import React from "react";
import type { LucideIcon } from "lucide-react";

interface PageShellProps {
  /** Page heading shown as the H2 */
  title: string;
  /** Short subtitle / description */
  subtitle?: string;
  /** Lucide icon rendered next to the title */
  icon: LucideIcon;
  /** Colour classes for the icon container, e.g. "bg-primary-900/10 text-primary-900" */
  iconColor?: string;
  /** Optional button / toolbar content placed to the right of the title */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function PageShell({
  title,
  subtitle,
  icon: Icon,
  iconColor = "bg-primary-900/10 text-primary-900",
  actions,
  children,
}: PageShellProps) {
  return (
    <section className="space-y-6">
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}
          >
            <Icon size={22} strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Content */}
      {children}
    </section>
  );
}
