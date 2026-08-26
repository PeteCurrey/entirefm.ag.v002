import React from 'react';

export function OperationalTelemetryStrip() {
  const metrics = [
    {
      value: '96.2%',
      label: 'SLA Performance',
      detail: 'Target 95.0% · On Track',
      highlight: 'text-emerald-600',
    },
    {
      value: '98.4%',
      label: 'Statutory Compliance',
      detail: 'Zero Breaches · Audit Ready',
      highlight: 'text-emerald-600',
    },
    {
      value: '3,846',
      label: 'Assets In Service',
      detail: '100% Asset Register Coverage',
      highlight: 'text-slate-900',
    },
    {
      value: '127',
      label: 'Live Work Orders',
      detail: 'Active Field Dispatch',
      highlight: 'text-slate-900',
    },
    {
      value: '£185k',
      label: 'Committed Works WIP',
      detail: 'Commercial Control Ledger',
      highlight: 'text-brand-pink',
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-10">
      <div className="container-custom">
        <div className="text-[10px] font-normal uppercase tracking-wider text-slate-400 mb-6 text-center lg:text-left">
          LIVE OPERATIONAL TELEMETRY // AUTHORISED CLIENT ESTATE AGGREGATE
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className={`flex flex-col justify-between ${
                idx > 0 ? 'lg:px-6' : 'lg:pr-6'
              } ${idx === metrics.length - 1 ? 'lg:pl-6' : ''}`}
            >
              <div>
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-500 block mb-1">
                  {m.label}
                </span>
                <div className={`text-3xl lg:text-4xl font-extralight tracking-tight ${m.highlight}`}>
                  {m.value}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-light mt-2 pt-2 border-t border-slate-100 lg:border-0 lg:pt-0">
                {m.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
