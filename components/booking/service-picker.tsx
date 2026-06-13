"use client";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/data/services";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

type ServicePickerProps = {
  services: Service[];
  value?: string;
  onChange: (serviceId: string) => void;
};

export function ServicePicker({ services, value, onChange }: ServicePickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {services.map((service) => {
        const selected = value === service.id;
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onChange(service.id)}
            className={cn(
              "rounded-xl border p-4 text-left transition-all hover:border-primary/40",
              selected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card",
            )}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="font-medium">{service.name}</span>
              <Badge variant="secondary">{service.category}</Badge>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">{service.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span>{service.duration_minutes} min</span>
              <span className="font-semibold">{formatPrice(service.price_cents)}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
