"use client";

export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-400 mb-4">
          <Icon size={26} />
        </div>
      )}
      <p className="text-[15px] font-bold text-plum">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-muted max-w-sm">{subtitle}</p>}
    </div>
  );
}
