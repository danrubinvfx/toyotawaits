import React from 'react';
import {
  AllocationDropAlertEmailInput,
  AllocationDropAlertVehicle,
  AMAZON_ASSOCIATES_DISCLOSURE,
  buildDropAlertEnrichment,
  generateAllocationDropAlertEmail,
  getCuratedGearForDropAlert,
  resolveAlertModelDisplay,
  resolveAlertModelSlug,
  SIENNA_HITCH_GUIDE_URL,
  formatVehicleHeader,
  resolveVehicleStatusBadge,
  formatVehiclePricing,
  formatVehicleDealership,
} from '@/lib/alerts/templates';

export {
  AMAZON_ASSOCIATES_DISCLOSURE,
  SIENNA_HITCH_GUIDE_URL,
  buildDropAlertEnrichment,
  generateAllocationDropAlertEmail,
  getCuratedGearForDropAlert,
  resolveAlertModelDisplay,
  resolveAlertModelSlug,
  formatVehicleHeader,
  resolveVehicleStatusBadge,
  formatVehiclePricing,
  formatVehicleDealership,
};
export type { AllocationDropAlertEmailInput, AllocationDropAlertVehicle };

export function AllocationDropAlertEmail(props: AllocationDropAlertEmailInput) {
  const email = generateAllocationDropAlertEmail(props);
  return <div dangerouslySetInnerHTML={{ __html: email.html }} />;
}

export default AllocationDropAlertEmail;
