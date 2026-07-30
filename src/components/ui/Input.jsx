import React from "react";

export default function Input({ label, error, icon: Icon, className = "", id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-800">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          id={inputId}
          className={`h-10 w-full rounded-lg border bg-white text-sm text-ink-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-slate-400 ${
            Icon ? "pl-9 pr-3" : "px-3"
          } ${error ? "border-rose-400" : "border-slate-200"} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
    </div>
  );
}
