'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  Car,
  ShoppingBag,
} from 'lucide-react';
import {
  auditQuote,
  inferFeeCategory,
  QUOTE_MODEL_PRESETS,
  PROVINCIAL_DEFAULTS,
  TYPICAL_DEALER_MARKUP_SAMPLE,
  FEE_AUTO_SUGGESTIONS,
  type ProvinceCode,
  type LineItem,
  type LineItemCategory,
  type ModelPreset,
} from '@/lib/compliance/quote-auditor';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';

interface EditableFeeRow extends LineItem {}

export function QuoteAuditorClient() {
  const [province, setProvince] = useState<ProvinceCode>('AB');
  const [selectedModelId, setSelectedModelId] = useState<string>('rav4-hybrid');
  const [dealerName, setDealerName] = useState<string>('');

  const selectedModel = useMemo<ModelPreset>(() => {
    return (
      QUOTE_MODEL_PRESETS.find((m) => m.id === selectedModelId) ||
      QUOTE_MODEL_PRESETS[0]
    );
  }, [selectedModelId]);

  const provincialDefaults = useMemo(() => {
    return PROVINCIAL_DEFAULTS[province] || PROVINCIAL_DEFAULTS.OTHER;
  }, [province]);

  // Statutory values
  const [msrp, setMsrp] = useState<number>(QUOTE_MODEL_PRESETS[0].msrp);
  const [freightPdi, setFreightPdi] = useState<number>(QUOTE_MODEL_PRESETS[0].freightPdi);
  const [acTax, setAcTax] = useState<number>(100);
  const [tireLevy, setTireLevy] = useState<number>(20);
  const [regulatoryLevy, setRegulatoryLevy] = useState<number>(10);
  const [licensing, setLicensing] = useState<number>(90);

  // Fee rows
  const [feeRows, setFeeRows] = useState<EditableFeeRow[]>([
    {
      id: 'fee-init-1',
      name: 'Documentation / Admin Fee',
      category: 'doc_fee',
      amount: 695,
    },
    {
      id: 'fee-init-2',
      name: 'Engine Block Heater',
      category: 'block_heater',
      amount: 750,
    },
  ]);

  const [copied, setCopied] = useState<boolean>(false);

  // When model changes, update MSRP and Freight
  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    const preset = QUOTE_MODEL_PRESETS.find((p) => p.id === modelId);
    if (preset) {
      setMsrp(preset.msrp);
      setFreightPdi(preset.freightPdi);
    }
  };

  // When province changes, update statutory levies
  const handleProvinceChange = (newProvince: ProvinceCode) => {
    setProvince(newProvince);
    const defs = PROVINCIAL_DEFAULTS[newProvince];
    setRegulatoryLevy(defs.regulatoryLevy);
    setTireLevy(defs.tireLevy);
    setLicensing(defs.typicalLicensing);
  };

  // Load Typical Dealer Markup Sample (Alberta Case Study)
  const handleLoadSample = () => {
    setProvince('AB');
    const abDefs = PROVINCIAL_DEFAULTS.AB;
    setRegulatoryLevy(abDefs.regulatoryLevy);
    setTireLevy(abDefs.tireLevy);
    setLicensing(abDefs.typicalLicensing);
    setSelectedModelId('rav4-hybrid');
    setMsrp(36150);
    setFreightPdi(1930);
    setFeeRows([...TYPICAL_DEALER_MARKUP_SAMPLE]);
  };

  const handleAddFeeRow = (preset?: { name: string; category: LineItemCategory; defaultAmount: number }) => {
    const nextId = `fee-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setFeeRows((prev) => [
      ...prev,
      {
        id: nextId,
        name: preset?.name || '',
        category: preset?.category || 'other',
        amount: preset?.defaultAmount || 0,
      },
    ]);
  };

  const handleRemoveFeeRow = (id: string) => {
    setFeeRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateFeeRow = (id: string, field: keyof LineItem, val: string | number) => {
    setFeeRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (field === 'name') {
          const strVal = String(val);
          const inferredCat = inferFeeCategory(strVal);
          return {
            ...row,
            name: strVal,
            category: inferredCat !== 'statutory' ? inferredCat : row.category,
          };
        }
        if (field === 'amount') {
          const num = typeof val === 'number' ? val : parseFloat(val) || 0;
          return { ...row, amount: Math.max(0, num) };
        }
        if (field === 'category') {
          return { ...row, category: val as LineItemCategory };
        }
        return row;
      })
    );
  };

  const handleResetStatutory = () => {
    setMsrp(selectedModel.msrp);
    setFreightPdi(selectedModel.freightPdi);
    setAcTax(provincialDefaults.acTax);
    setTireLevy(provincialDefaults.tireLevy);
    setRegulatoryLevy(provincialDefaults.regulatoryLevy);
    setLicensing(provincialDefaults.typicalLicensing);
  };

  // Compile all line items for the audit engine
  const allLineItems = useMemo<LineItem[]>(() => {
    const statutoryItems: LineItem[] = [
      { id: 'stat-msrp', name: `${selectedModel.name} Base MSRP`, category: 'statutory', amount: msrp },
      { id: 'stat-freight', name: 'Freight & PDI', category: 'statutory', amount: freightPdi },
      { id: 'stat-actax', name: 'Federal Air Conditioning Excise Tax', category: 'statutory', amount: acTax },
      { id: 'stat-tire', name: 'Provincial Tire Recycling Levy', category: 'statutory', amount: tireLevy },
    ];

    if (regulatoryLevy > 0) {
      statutoryItems.push({
        id: 'stat-reg-fee',
        name: provincialDefaults.regulatoryLevyName,
        category: 'statutory',
        amount: regulatoryLevy,
      });
    }

    if (licensing > 0) {
      statutoryItems.push({
        id: 'stat-licensing',
        name: 'Provincial Licensing & Plate Fees',
        category: 'statutory',
        amount: licensing,
      });
    }

    return [...statutoryItems, ...feeRows];
  }, [
    selectedModel.name,
    msrp,
    freightPdi,
    acTax,
    tireLevy,
    regulatoryLevy,
    licensing,
    provincialDefaults.regulatoryLevyName,
    feeRows,
  ]);

  // Run audit engine
  const auditResult = useMemo(() => {
    return auditQuote(allLineItems, province, {
      modelName: selectedModel.name,
      dealerName: dealerName.trim() || undefined,
    });
  }, [allLineItems, province, selectedModel.name, dealerName]);

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(auditResult.rebuttalScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  // Build Amazon Bridge URLs
  const tuxMatUrl = useMemo(
    () =>
      buildAmazonAffiliateUrl({
        query: `TuxMat Toyota ${selectedModel.name} custom floor mats`,
        market: 'CA',
      }),
    [selectedModel.name]
  );

  const fitcamxUrl = useMemo(
    () =>
      buildAmazonAffiliateUrl({
        query: `Fitcamx dash cam Toyota ${selectedModel.name} OEM look`,
        market: 'CA',
      }),
    [selectedModel.name]
  );

  const spigenUrl = useMemo(
    () =>
      buildAmazonAffiliateUrl({
        query: `Spigen screen protector Toyota ${selectedModel.name} tempered glass`,
        market: 'CA',
      }),
    [selectedModel.name]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Header */}
      <div className="relative border-b border-zinc-800 bg-gradient-to-b from-zinc-900/80 via-zinc-950 to-zinc-950 pt-10 pb-8 sm:pb-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Provincial Compliance Engine</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
              🇨🇦 All-In Pricing Rules (AMVIC • OMVIC • VSA)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
            Canadian Dealer Quote Auditor <span className="text-amber-500">&amp;</span> Fee De-Bunker
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Check your Toyota dealership worksheet against provincial all-in pricing regulations.
            Detect padded $800+ doc fees, $800 block heaters, and forced protection packages before signing your bill of sale.
          </p>

          {/* Quick Preset Action Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Load Typical Dealer Markup Sample (AB Case Study)</span>
            </button>
            <span className="text-xs text-zinc-500 hidden sm:inline">
              Prefills $888 Doc Fee, $802 Block Heater, $1,500 Protections, and $2,644 ECP.
            </span>
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
        {/* Step 1: Configuration Controls */}
        <section aria-labelledby="config-heading" className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 id="config-heading" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">1</span>
              <span>Vehicle &amp; Provincial Jurisdiction</span>
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Target: {provincialDefaults.regulatorShort}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Province Selector */}
            <div className="space-y-1.5">
              <label htmlFor="province-select" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Target Province
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { code: 'AB', label: 'Alberta (AMVIC)' },
                    { code: 'ON', label: 'Ontario (OMVIC)' },
                    { code: 'BC', label: 'BC (VSA)' },
                    { code: 'OTHER', label: 'Other / Canada' },
                  ] as const
                ).map((prov) => (
                  <button
                    key={prov.code}
                    type="button"
                    onClick={() => handleProvinceChange(prov.code)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-left ${
                      province === prov.code
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-bold'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {prov.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5">
              <label htmlFor="model-select" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Target Toyota Model
              </label>
              <select
                id="model-select"
                value={selectedModelId}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs sm:text-sm text-zinc-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {QUOTE_MODEL_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (MSRP: ${p.msrp.toLocaleString()})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-500">
                Pre-populates official Canadian MSRP &amp; standard Freight &amp; PDI.
              </p>
            </div>

            {/* Dealer Name (Optional) */}
            <div className="space-y-1.5">
              <label htmlFor="dealer-input" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Dealership Name (Optional)
              </label>
              <input
                id="dealer-input"
                type="text"
                placeholder="e.g. Southgate Toyota, Erin Park Toyota"
                value={dealerName}
                onChange={(e) => setDealerName(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <p className="text-[11px] text-zinc-500">
                Injected into your 1-click counter-offer rebuttal email script.
              </p>
            </div>
          </div>
        </section>

        {/* Step 2: Interactive Worksheet Builder */}
        <section aria-labelledby="worksheet-heading" className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-3 gap-2">
            <div>
              <h2 id="worksheet-heading" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">2</span>
                <span>Worksheet Builder: Statutory Baseline vs Dealer Fees</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Enter line items as shown on your dealership buyer order or quote worksheet.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetStatutory}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Statutory Defaults</span>
            </button>
          </div>

          {/* Statutory Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Statutory &amp; Legitimate Line Items (Standard Non-Negotiables)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400">Base MSRP</label>
                <div className="flex items-center text-xs text-zinc-200 font-mono">
                  <span className="text-zinc-500 mr-1">$</span>
                  <input
                    type="number"
                    value={msrp}
                    onChange={(e) => setMsrp(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-transparent focus:outline-none focus:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400">Freight &amp; PDI</label>
                <div className="flex items-center text-xs text-zinc-200 font-mono">
                  <span className="text-zinc-500 mr-1">$</span>
                  <input
                    type="number"
                    value={freightPdi}
                    onChange={(e) => setFreightPdi(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-transparent focus:outline-none focus:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400">Federal AC Tax</label>
                <div className="flex items-center text-xs text-zinc-200 font-mono">
                  <span className="text-zinc-500 mr-1">$</span>
                  <input
                    type="number"
                    value={acTax}
                    onChange={(e) => setAcTax(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-transparent focus:outline-none focus:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400">Tire Recycling</label>
                <div className="flex items-center text-xs text-zinc-200 font-mono">
                  <span className="text-zinc-500 mr-1">$</span>
                  <input
                    type="number"
                    value={tireLevy}
                    onChange={(e) => setTireLevy(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-transparent focus:outline-none focus:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400">{provincialDefaults.regulatorShort} Fee</label>
                <div className="flex items-center text-xs text-zinc-200 font-mono">
                  <span className="text-zinc-500 mr-1">$</span>
                  <input
                    type="number"
                    value={regulatoryLevy}
                    onChange={(e) => setRegulatoryLevy(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-transparent focus:outline-none focus:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400">Licensing/Plates</label>
                <div className="flex items-center text-xs text-zinc-200 font-mono">
                  <span className="text-zinc-500 mr-1">$</span>
                  <input
                    type="number"
                    value={licensing}
                    onChange={(e) => setLicensing(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-transparent focus:outline-none focus:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dealer Fee Rows Section */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                <AlertTriangle className="h-4 w-4" />
                <span>Dealer Fees, Packages &amp; Add-Ons (Subject to Audit)</span>
              </div>
              <button
                type="button"
                onClick={() => handleAddFeeRow()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Custom Fee</span>
              </button>
            </div>

            {/* Quick-add chips */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-zinc-400">Quick-Add Common Dealer Add-Ons:</span>
              <div className="flex flex-wrap gap-1.5">
                {FEE_AUTO_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug.name}
                    type="button"
                    onClick={() => handleAddFeeRow(sug)}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-300 text-zinc-300 transition-all cursor-pointer"
                  >
                    <span>+ {sug.name}</span>
                    <span className="text-zinc-500 font-mono">(${sug.defaultAmount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fee Items Table / Cards */}
            <div className="space-y-2 pt-2">
              {feeRows.length === 0 ? (
                <div className="p-6 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 text-xs text-zinc-500">
                  No dealer fee rows added. Click above to add doc fees, block heaters, rust protection, or warranties.
                </div>
              ) : (
                feeRows.map((row) => (
                  <div
                    key={row.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 rounded-xl border border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Fee Description (e.g. Doc Fee, Rust Module, ECP)"
                        value={row.name}
                        onChange={(e) => handleUpdateFeeRow(row.id, 'name', e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={row.category}
                        onChange={(e) => handleUpdateFeeRow(row.id, 'category', e.target.value)}
                        className="text-xs rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-zinc-300 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="doc_fee">Doc / Admin Fee</option>
                        <option value="block_heater">Block Heater</option>
                        <option value="protection">Protection / Rust / PPF</option>
                        <option value="warranty">ECP Extended Warranty</option>
                        <option value="other">Other Add-on</option>
                      </select>

                      <div className="flex items-center text-xs font-mono bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 w-28">
                        <span className="text-zinc-500 mr-1">$</span>
                        <input
                          type="number"
                          value={row.amount || ''}
                          placeholder="0"
                          onChange={(e) => handleUpdateFeeRow(row.id, 'amount', e.target.value)}
                          className="w-full bg-transparent focus:outline-none font-bold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFeeRow(row.id)}
                        aria-label={`Remove ${row.name || 'fee'}`}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Step 3: Live Audit Scorecard */}
        <section aria-labelledby="scorecard-heading" className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 id="scorecard-heading" className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">3</span>
              <span>Live Audit Scorecard &amp; Savings Tally</span>
            </h2>
            <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
              <span>Jurisdiction:</span>
              <strong className="text-amber-400">{provincialDefaults.regulatorShort} ({provincialDefaults.provinceName})</strong>
            </div>
          </div>

          {/* 3 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Quoted Price Total */}
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-1 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">1. Total Quoted Price</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                ${auditResult.totalQuoted.toLocaleString()} <span className="text-xs text-zinc-500 font-sans">CAD</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                MSRP + all taxes, levies, and dealership line items before GST/HST.
              </p>
            </div>

            {/* Card 2: Legitimate Statutory MSRP */}
            <div className="p-5 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 space-y-1 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">2. Legitimate Base + Levies</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
                ${auditResult.statutoryTotal.toLocaleString()} <span className="text-xs text-emerald-500/80 font-sans">CAD</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Official MSRP, Freight/PDI, AC Tax, Tire levy &amp; actual licensing.
              </p>
            </div>

            {/* Card 3: Negotiable / Bogus Add-ons */}
            <div className="p-5 rounded-2xl border border-rose-900/50 bg-rose-950/25 space-y-1 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">3. Negotiable Dealer Margin</span>
                <AlertTriangle className="h-4 w-4 text-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                ${auditResult.negotiableTotal.toLocaleString()} <span className="text-xs text-rose-500/80 font-sans">CAD</span>
              </div>
              <p className="text-[11px] font-semibold text-rose-300">
                {auditResult.negotiableTotal > 0
                  ? `You can save up to $${auditResult.negotiableTotal.toLocaleString()} CAD by challenging these line items.`
                  : 'Zero non-statutory dealer markups detected. Clean quote!'}
              </p>
            </div>
          </div>

          {/* Itemized Flag Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Itemized Flag Audit ({auditResult.flaggedItems.length} items flagged)
            </h3>

            {auditResult.flaggedItems.length === 0 ? (
              <div className="p-6 rounded-2xl border border-emerald-900/40 bg-emerald-950/15 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-200">Clean Dealership Quote!</h4>
                  <p className="text-xs text-zinc-400">
                    No illegal doc fees, heavily marked-up block heaters, or forced protection packages were detected.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {auditResult.flaggedItems.map((flag, idx) => (
                  <div
                    key={`${flag.name}-${idx}`}
                    className="p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-3 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            FLAGGED MARKUP
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-white">{flag.name}</h4>
                        </div>
                        {flag.statutoryRule && (
                          <p className="text-xs text-amber-400 font-semibold mt-1">
                            ⚖️ {flag.statutoryRule}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-center">
                        <div className="text-right">
                          <div className="text-xs text-zinc-400">Quoted Amount</div>
                          <div className="text-sm sm:text-base font-bold font-mono text-rose-400">
                            ${flag.amount.toLocaleString()} CAD
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-600 hidden sm:block" />
                        <div className="text-right">
                          <div className="text-xs text-zinc-400">Recommended Target</div>
                          <div className="text-sm sm:text-base font-bold font-mono text-emerald-400">
                            ${flag.recommendedTarget.toLocaleString()} CAD
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {flag.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Step 4: 1-Click Action Deliverables */}
        <section aria-labelledby="deliverables-heading" className="space-y-6 pt-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <h3 id="deliverables-heading" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-500" />
                  <span>1-Click Counter-Offer Rebuttal Script</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Polite, professional email tailored to {provincialDefaults.regulatorShort} regulations to send your sales representative.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyScript}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-zinc-950" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-zinc-950" />
                    <span>Copy Counter-Offer Script</span>
                  </>
                )}
              </button>
            </div>

            {/* Script Display */}
            <pre className="p-4 sm:p-5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed overflow-x-auto selection:bg-amber-500 selection:text-zinc-950">
              {auditResult.rebuttalScript}
            </pre>
          </div>

          {/* "What to Buy Instead" Bridge */}
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-zinc-950/80 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>What to Buy Instead</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Day-One Protection Essentials: Skip Dealership Overcharging
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
                Dealerships charge $1,500–$3,500 for generic accessories and sprays. Protect your {selectedModel.name} on day one with verified hero gear at authentic retail pricing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* TuxMat Floor Liners */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Floor &amp; Carpet Defense
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100">
                    TuxMat Custom All-Weather Liners
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Canadian-engineered maximum ridge coverage that guards against salt brine and slush. Beats factory Toyota rubber mats with complete dead-pedal and sidewall shielding.
                  </p>
                </div>
                <a
                  href={tuxMatUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer nofollow"
                  className="inline-flex items-center justify-between w-full px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-amber-400 border border-zinc-800 hover:border-amber-500/40 transition-colors"
                >
                  <span>Search TuxMat on Amazon</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* FitcamX Dash Cam */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                    OEM Integration
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100">
                    FitcamX OEM-Look Integrated Dashcam
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Snaps directly behind the Toyota Safety Sense rear-view mirror cowl. Zero dangling wires, plug-and-play Y-harness power, 4K recording without voiding warranty.
                  </p>
                </div>
                <a
                  href={fitcamxUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer nofollow"
                  className="inline-flex items-center justify-between w-full px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-blue-400 border border-zinc-800 hover:border-blue-500/40 transition-colors"
                >
                  <span>Search FitcamX on Amazon</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Spigen Screen Protector */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Touchscreen Defense
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100">
                    Spigen Tempered Glass Screen Protector
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    9H matte oleophobic glass that eliminates fingerprint smudges and glare on Toyota infotainment displays. Replaces $200+ dealer screen coating charges for under $40 CAD.
                  </p>
                </div>
                <a
                  href={spigenUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer nofollow"
                  className="inline-flex items-center justify-between w-full px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-emerald-400 border border-zinc-800 hover:border-emerald-500/40 transition-colors"
                >
                  <span>Search Spigen on Amazon</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
