/**
 * lib/discovery/services/ingestion-service.ts
 *
 * Ingestion Service for ToyotaWaits.ca Master Plan V3.2
 * Sprint 3: Ingestion Pipeline, Observation Persistence & Transition Detection
 *
 * Core Requirements:
 * 1. Writes strictly to isolated discovery tables (sources, dealers, vehicles, dealer_listings, observations, status_events).
 * 2. Matches vehicles by true 17-char VIN if present; otherwise maintains provisional vehicle entities (never synthesizing VINs).
 * 3. Upserts dealer listings on (dealer_id, source_listing_id), updating last_observed_at and last_successful_check.
 * 4. Logs transition audit trail in status_events when normalized status changes.
 * 5. Calculates and stores SHA-256 payload hash on observations.
 */

import * as crypto from 'crypto';
import { createServerClient } from '../../../src/lib/supabase/server';
import {
  NormalizedListingStatus,
  ParsedVehicleListing,
} from '../types';

export interface IngestDealerListingsParams {
  dealerId: string;
  sourceId: string;
  parsedListings: ParsedVehicleListing[];
  sweepTimestamp?: string;
  supabaseClient?: any;
  db?: any;
}

export interface IngestionSummary {
  totalProcessed: number;
  vehiclesCreated: number;
  vehiclesLinked: number;
  listingsCreated: number;
  listingsUpdated: number;
  observationsStored: number;
  statusTransitionsDetected: number;
  statusEventsLogged: number;
  errors: Array<{ listingId?: string; error: string }>;
}

/**
 * Calculates SHA-256 hash of normalized vehicle listing payload.
 */
export function computePayloadHash(item: ParsedVehicleListing): string {
  const content = JSON.stringify({
    vehicle: item.vehicle,
    listing: {
      sourceListingId: item.listing.sourceListingId,
      stockNumber: item.listing.stockNumber,
      normalizedStatus: item.listing.normalizedStatus,
      rawStatus: item.listing.rawStatus,
    },
    pricing: item.pricing,
  });
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Atomically ingests parsed vehicle listings for a specific dealer.
 */
export async function ingestDealerListings(
  params: IngestDealerListingsParams
): Promise<IngestionSummary> {
  const {
    dealerId,
    parsedListings,
    sweepTimestamp = new Date().toISOString(),
    supabaseClient,
    db,
  } = params;

  const supabase = supabaseClient || db || createServerClient();

  const summary: IngestionSummary = {
    totalProcessed: 0,
    vehiclesCreated: 0,
    vehiclesLinked: 0,
    listingsCreated: 0,
    listingsUpdated: 0,
    observationsStored: 0,
    statusTransitionsDetected: 0,
    statusEventsLogged: 0,
    errors: [],
  };

  for (const item of parsedListings) {
    summary.totalProcessed++;

    try {
      // -------------------------------------------------------------
      // 1. Vehicle Matching & Upsert
      // -------------------------------------------------------------
      let vehicleId: string | null = null;

      if (item.vehicle.vin && !item.vehicle.isProvisionalVin) {
        // Match by true 17-character VIN
        const { data: existingVinVehicle, error: vinSearchError } = await supabase
          .from('vehicles')
          .select('id, make, model')
          .eq('vin', item.vehicle.vin)
          .maybeSingle();

        if (vinSearchError) {
          throw new Error(`Vehicle search by VIN failed: ${vinSearchError.message}`);
        }

        if (existingVinVehicle) {
          vehicleId = existingVinVehicle.id;
          summary.vehiclesLinked++;
        } else {
          // Insert new verified vehicle
          const { data: newVehicle, error: vinInsertError } = await supabase
            .from('vehicles')
            .insert({
              vin: item.vehicle.vin,
              provisional_id: null,
              is_provisional_vin: false,
              make: item.vehicle.make,
              model: item.vehicle.model,
              trim: item.vehicle.trim,
              model_year: item.vehicle.modelYear,
              model_code: item.vehicle.modelCode,
              package_code: item.vehicle.packageCode,
              body_style: item.vehicle.bodyStyle,
              powertrain: item.vehicle.powertrain,
              transmission: item.vehicle.transmission,
              drive_train: item.vehicle.driveTrain,
              exterior_color: item.vehicle.exteriorColor,
              interior_color: item.vehicle.interiorColor,
              created_at: sweepTimestamp,
              updated_at: sweepTimestamp,
            })
            .select('id')
            .single();

          if (vinInsertError) {
            throw new Error(`Vehicle insert by VIN failed: ${vinInsertError.message}`);
          }
          vehicleId = newVehicle.id;
          summary.vehiclesCreated++;
        }
      } else {
        // Provisional vehicle (VIN missing or unverified; never synthesize fake VIN)
        const provisionalId = item.vehicle.provisionalId;
        const { data: existingProvVehicle, error: provSearchError } = await supabase
          .from('vehicles')
          .select('id')
          .eq('provisional_id', provisionalId)
          .maybeSingle();

        if (provSearchError) {
          throw new Error(`Vehicle search by provisional ID failed: ${provSearchError.message}`);
        }

        if (existingProvVehicle) {
          vehicleId = existingProvVehicle.id;
          summary.vehiclesLinked++;
        } else {
          const { data: newVehicle, error: provInsertError } = await supabase
            .from('vehicles')
            .insert({
              vin: null,
              provisional_id: provisionalId,
              is_provisional_vin: true,
              make: item.vehicle.make,
              model: item.vehicle.model,
              trim: item.vehicle.trim,
              model_year: item.vehicle.modelYear,
              model_code: item.vehicle.modelCode,
              package_code: item.vehicle.packageCode,
              body_style: item.vehicle.bodyStyle,
              powertrain: item.vehicle.powertrain,
              transmission: item.vehicle.transmission,
              drive_train: item.vehicle.driveTrain,
              exterior_color: item.vehicle.exteriorColor,
              interior_color: item.vehicle.interiorColor,
              created_at: sweepTimestamp,
              updated_at: sweepTimestamp,
            })
            .select('id')
            .single();

          if (provInsertError) {
            throw new Error(`Vehicle insert by provisional ID failed: ${provInsertError.message}`);
          }
          vehicleId = newVehicle.id;
          summary.vehiclesCreated++;
        }
      }

      if (!vehicleId) {
        throw new Error('Failed to resolve or create canonical vehicle record');
      }

      // -------------------------------------------------------------
      // 2. Dealer Listing Upsert & Status Transition Detection
      // -------------------------------------------------------------
      const { data: existingListing, error: listingSearchError } = await supabase
        .from('dealer_listings')
        .select('*')
        .eq('dealer_id', dealerId)
        .eq('source_listing_id', item.listing.sourceListingId)
        .maybeSingle();

      if (listingSearchError) {
        throw new Error(`Dealer listing lookup failed: ${listingSearchError.message}`);
      }

      let dealerListingId: string;
      let pendingStatusEvent: {
        previousStatus: NormalizedListingStatus | null;
        newStatus: NormalizedListingStatus;
        transitionReason: string;
        evidencePayload: Record<string, any>;
      } | null = null;

      if (!existingListing) {
        // Initial Discovery of Listing
        const { data: newListing, error: listingInsertError } = await supabase
          .from('dealer_listings')
          .insert({
            dealer_id: dealerId,
            vehicle_id: vehicleId,
            source_listing_id: item.listing.sourceListingId,
            stock_number: item.listing.stockNumber,
            vdp_url: item.listing.vdpUrl,
            current_status: item.listing.normalizedStatus,
            raw_status: item.listing.rawStatus,
            days_on_lot: item.listing.daysOnLot ?? 0,
            consecutive_missed_sweeps: 0,
            first_observed_at: sweepTimestamp,
            last_observed_at: sweepTimestamp,
            last_successful_check: sweepTimestamp,
            created_at: sweepTimestamp,
            updated_at: sweepTimestamp,
          })
          .select('id')
          .single();

        if (listingInsertError) {
          throw new Error(`Dealer listing insert failed: ${listingInsertError.message}`);
        }

        dealerListingId = newListing.id;
        summary.listingsCreated++;

        // Log initial listing event
        pendingStatusEvent = {
          previousStatus: null,
          newStatus: item.listing.normalizedStatus,
          transitionReason: 'Initial listing discovery in dealer feed',
          evidencePayload: {
            source_listing_id: item.listing.sourceListingId,
            raw_status: item.listing.rawStatus,
            stock_number: item.listing.stockNumber,
          },
        };
      } else {
        // Existing Listing Observed
        dealerListingId = existingListing.id;

        const statusChanged =
          existingListing.current_status !== item.listing.normalizedStatus;

        if (statusChanged) {
          summary.statusTransitionsDetected++;
          pendingStatusEvent = {
            previousStatus: existingListing.current_status as NormalizedListingStatus,
            newStatus: item.listing.normalizedStatus,
            transitionReason: `Status transition observed in sweep: '${existingListing.current_status}' -> '${item.listing.normalizedStatus}'`,
            evidencePayload: {
              previous_status: existingListing.current_status,
              new_status: item.listing.normalizedStatus,
              raw_status: item.listing.rawStatus,
              previous_raw_status: existingListing.raw_status,
              source_listing_id: item.listing.sourceListingId,
            },
          };
        }

        // Update listing timestamps and reset missed sweeps
        const { error: listingUpdateError } = await supabase
          .from('dealer_listings')
          .update({
            current_status: item.listing.normalizedStatus,
            raw_status: item.listing.rawStatus,
            days_on_lot: item.listing.daysOnLot ?? existingListing.days_on_lot,
            stock_number: item.listing.stockNumber || existingListing.stock_number,
            vdp_url: item.listing.vdpUrl || existingListing.vdp_url,
            consecutive_missed_sweeps: 0,
            last_observed_at: sweepTimestamp,
            last_successful_check: sweepTimestamp,
            updated_at: sweepTimestamp,
          })
          .eq('id', dealerListingId);

        if (listingUpdateError) {
          throw new Error(`Dealer listing update failed: ${listingUpdateError.message}`);
        }

        summary.listingsUpdated++;
      }

      // -------------------------------------------------------------
      // 3. Observation Persistence (with SHA-256 Payload Hash)
      // -------------------------------------------------------------
      const payloadHash = computePayloadHash(item);

      const { data: newObservation, error: observationInsertError } = await supabase
        .from('observations')
        .insert({
          dealer_listing_id: dealerListingId,
          observed_at: sweepTimestamp,
          raw_status: item.listing.rawStatus,
          normalized_status: item.listing.normalizedStatus,
          msrp: item.pricing.msrp,
          raw_msrp: item.pricing.rawMsrp,
          advertised_price: item.pricing.askingPrice,
          raw_advertised_price: item.pricing.rawAskingPrice,
          selling_price: item.pricing.sellingPrice,
          raw_selling_price: item.pricing.rawSellingPrice,
          mandatory_fees: item.pricing.mandatoryFees ?? 0,
          has_unverified_fees: item.pricing.hasUnverifiedFees,
          raw_payload_hash: payloadHash,
          raw_payload: item.raw || null,
          created_at: sweepTimestamp,
        })
        .select('id')
        .single();

      if (observationInsertError) {
        throw new Error(`Observation insert failed: ${observationInsertError.message}`);
      }

      summary.observationsStored++;

      // -------------------------------------------------------------
      // 4. Status Event Logging (Linking Observation Reference)
      // -------------------------------------------------------------
      if (pendingStatusEvent) {
        const { error: statusEventError } = await supabase
          .from('status_events')
          .insert({
            dealer_listing_id: dealerListingId,
            observation_id: newObservation.id,
            previous_status: pendingStatusEvent.previousStatus,
            new_status: pendingStatusEvent.newStatus,
            transition_reason: pendingStatusEvent.transitionReason,
            evidence_payload: pendingStatusEvent.evidencePayload,
            event_timestamp: sweepTimestamp,
            created_at: sweepTimestamp,
          });

        if (statusEventError) {
          throw new Error(`Status event insert failed: ${statusEventError.message}`);
        }

        summary.statusEventsLogged++;
      }
    } catch (err: any) {
      summary.errors.push({
        listingId: item.listing.sourceListingId,
        error: err?.message || String(err),
      });
    }
  }

  return summary;
}
