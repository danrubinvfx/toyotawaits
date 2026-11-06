import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  HelpCircle,
  FileCheck2,
  AlertTriangle,
  Train,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export function DealerTrackingTips() {
  return (
    <div className="space-y-8 pt-4">
      {/* 1. Dealer Tracking Secrets & Pro-Tips */}
      <section aria-label="Dealer Tracking Secrets and Logistics Pro-Tips" className="space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400">
            <Train className="h-3.5 w-3.5" />
            <span>Dealer Daily Intelligence</span>
            <span className="text-zinc-600">•</span>
            <span>Insider Logistics Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Dealer Tracking FAQ &amp; Logistics Pro-Tips</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
            Demystify what dealership inventory managers can actually see behind the sales desk
            and protect your signed bill of sale against unexpected delivery fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Train Tracking */}
          <Card className="border-zinc-800 bg-zinc-900/60 p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Train className="w-4 h-4 shrink-0" />
                <span>Can My Dealer Track the Train?</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Yes — The Dealer Daily Logistics Portal Has Railcar IDs
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Dealership Sales Managers and inventory controllers have direct access to Toyota&apos;s internal{' '}
                <strong>Dealer Daily</strong> portal. Once a vehicle reaches Status F, the portal displays the exact{' '}
                <strong>CN or CPKC railcar number</strong>, railhead interchange junction, and ETA delivery windows.
                If your salesperson says &ldquo;we have no way to know where it is,&rdquo; ask to speak with the inventory manager.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-cyan-300">
              💡 <strong>Pro-Tip:</strong> Ask for the &ldquo;Dealer Daily Vehicle Inquiry printout&rdquo; when Status F is confirmed.
            </div>
          </Card>

          {/* Card 2: VIN Build Sheet */}
          <Card className="border-zinc-800 bg-zinc-900/60 p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span>How to Request Your VIN Build Sheet</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Locking in Your Official Factory Specification
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                As soon as your build transitions from temporary allocation spec to Status F, a complete{' '}
                <strong>17-character VIN</strong> is minted. Request the official Toyota factory build sheet or spec summary
                from your dealer. This verifies your factory accessories, wheel sizing, audio packages, and port-installed equipment
                before the vehicle reaches Ground status.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-emerald-300">
              📋 <strong>Action:</strong> Compare the VIN build sheet against your initial purchase deposit agreement.
            </div>
          </Card>

          {/* Card 3: PDI Add-on Defense */}
          <Card className="border-zinc-800 bg-zinc-900/60 p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Watch Out for PDI Add-Ons</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Reject Unrequested Dealer Packs on Arrival
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                During the 24–48 hour Pre-Delivery Inspection (PDI), some aggressive dealerships slip in unrequested add-ons:
                $199 nitrogen tire fills, $499 security window etching, or $1,499 paint protection coatings.
                Under Canadian provincial regulations (OMVIC in Ontario, AMVIC in Alberta, VSA in BC), dealer accessories cannot
                be forced unless explicitly contracted in your signed Bill of Sale.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-amber-300">
              🛡️ <strong>Rule:</strong> Inspect the invoice line-by-line before releasing final bank draft funds.
            </div>
          </Card>
        </div>
      </section>

      {/* 2. Cross-Link Integration: Order Your Day-One Gear Before Status G Arrival */}
      <section
        aria-label="Order Your Day-One Gear Before Status G Arrival"
        id="day-one-gear-crosslink"
        className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Smart Timing • Arrive Ready</span>
            <span className="text-zinc-600">•</span>
            <span>Direct Fit Tested</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Order Your Day-One Gear Before Status G Arrival
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
            Don&apos;t wait until pickup day to scramble for high-wall floor mats, console organizers, or tempered screen protectors.
            Package shipments typically take 3 to 7 days across Canada—order during Status F so your gear arrives right at your front door
            before taking handover at the dealership lot.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 bg-cyan-950/20 text-xs">
                Essential Protection Guide
              </Badge>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Best Toyota All-Weather Floor Mats Guide
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                TuxMat vs WeatherTech vs OEM Toyota floor liners. Verified laser-fit models for RAV4, Sienna, Grand Highlander,
                and Camry protecting your interior carpets from Canadian winter road salt and mud.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/guides/best-toyota-all-weather-floor-mats"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-4 text-xs transition-colors shadow-lg"
              >
                <span>Compare All-Weather Floor Mats</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <Badge variant="outline" className="border-amber-500/40 text-amber-300 bg-amber-950/20 text-xs">
                Top Rated Drop-Ins
              </Badge>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Toyota RAV4 Must-Have Accessories Guide
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Field-tested interior organizers, OEM-look integrated 4K dash cams (FitcamX), tempered touchscreen protectors,
                and custom cargo trays tailored for 2019–2026+ RAV4 Hybrid &amp; Prime owners.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/guides/toyota-rav4-must-have-accessories"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2.5 px-4 text-xs transition-colors shadow-lg"
              >
                <span>Browse RAV4 Must-Have Accessories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DealerTrackingTips;
