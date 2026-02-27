"use client";

import { ChangeEvent } from "react";
import { FormField, FormLabel } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "date" | "tel" | "number";
}) {
  return (
    <FormField>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </FormField>
  );
}

export function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <FormField>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Input
        id={id}
        type="number"
        value={Number.isNaN(value) ? "" : String(value)}
        onChange={(event) => onChange(Number(event.target.value || 0))}
      />
    </FormField>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <FormField>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <select
        id={id}
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border border-input"
      />
      {label}
    </label>
  );
}
