"use client";
import { useSyncExternalStore, useState } from "react";
import { ArrowRight, Check, Info, RotateCcw, Save, Search } from "lucide-react";
import {
  mappingFields,
  defaultMappings,
  targetFields,
  mappingStorageKey,
} from "@/lib/mappings";
import { PageHeading } from "./page-heading";
import { FieldSelect } from "./field-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
const subscribe = () => () => {};
export function MappingEditor() {
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return ready ? (
    <LoadedMappingEditor />
  ) : (
    <p role="status" className="text-sm text-muted-foreground">
      Loading field mappings…
    </p>
  );
}
function readMappings() {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(mappingStorageKey) || "null",
    );
    if (typeof parsed === "object" && parsed !== null)
      return Object.fromEntries(
        mappingFields.map((field) => {
          const value = (parsed as Record<string, unknown>)[field.source];
          return [
            field.source,
            typeof value === "string" &&
            (value === "" || targetFields.includes(value))
              ? value
              : field.target,
          ];
        }),
      );
  } catch {
    /* Invalid or unavailable demo storage falls back to defaults. */
  }
  return defaultMappings;
}
function LoadedMappingEditor() {
  const [mappings, setMappings] = useState(readMappings);
  const [saved, setSaved] = useState(mappings);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const dirty = JSON.stringify(mappings) !== JSON.stringify(saved);
  const count = Object.values(mappings).filter(Boolean).length;
  const filtered = mappingFields.filter((field) =>
    `${field.label} ${field.source} ${mappings[field.source]}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  function save() {
    if (
      mappingFields.some((field) => field.required && !mappings[field.source])
    ) {
      setMessage("Map all required fields before saving.");
      return;
    }
    const selected = Object.values(mappings).filter(Boolean);
    if (new Set(selected).size !== selected.length) {
      setMessage("Each target field can only be mapped once.");
      return;
    }
    try {
      localStorage.setItem(mappingStorageKey, JSON.stringify(mappings));
      setSaved({ ...mappings });
      setMessage("Mappings saved in this browser.");
    } catch {
      setMessage(
        "Unable to save mappings. Browser storage may be unavailable.",
      );
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="Catalog configuration"
        title="Field Mapping"
        description="Connect your catalog fields to the language of procurement."
        action={
          <Button onClick={save} disabled={!dirty}>
            <Save />
            Save changes
          </Button>
        }
      />
      <div className="mb-6 flex gap-3 rounded-lg border p-4 text-sm leading-5 text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          Define how product information is transferred to your customers.
          Changes are saved locally for this demo and don’t affect live
          connections.
        </p>
      </div>
      <div className="mb-5 grid grid-cols-3 divide-x rounded-xl border bg-white py-4">
        {[
          { value: "cXML", label: "Output format" },
          { value: `${count} / 8`, label: "Fields mapped" },
          { value: "Default", label: "Mapping profile" },
        ].map((item) => (
          <div className="px-4" key={item.label}>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">
            Product fields{" "}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              8 fields
            </span>
          </h2>
          <div className="relative w-full sm:w-52">
            <Search className="absolute top-2 left-2.5 size-4 text-muted-foreground" />
            <Input
              aria-label="Search fields"
              placeholder="Search fields…"
              className="pl-8 text-sm"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border">
          <div className="grid grid-cols-[1fr_1.2fr] gap-4 border-b bg-muted px-4 py-3 text-sm font-medium tracking-wider text-muted-foreground uppercase">
            <span>Catalog field</span>
            <span>Procurement field</span>
          </div>
          <div className="divide-y">
            {filtered.map((field) => (
              <div
                key={field.source}
                className="grid grid-cols-[1fr_1.2fr] items-center gap-4 px-4 py-3.5"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-medium">{field.label}</p>
                    {field.required && (
                      <span className="text-primary" aria-label="required">
                        *
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-sm text-muted-foreground">
                    {field.source}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowRight className="hidden size-3.5 shrink-0 text-muted-foreground sm:block" />
                  <FieldSelect
                    label={`Target for ${field.label}`}
                    value={mappings[field.source]}
                    onChange={(value) => {
                      setMappings({ ...mappings, [field.source]: value });
                      setMessage("");
                    }}
                  />
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No fields match “{query}”.
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">
            <span className="text-primary">*</span> Required for a valid
            punchout transfer
          </span>
          <Button
            variant="ghost"
            size="sm"

            onClick={() => {
              setMappings({ ...defaultMappings });
              setMessage("Default mappings restored. Save changes to apply.");
            }}
          >
            <RotateCcw />
            Reset to defaults
          </Button>
        </div>
        <div
          className="mt-6 flex items-start gap-2 border-t pt-4"
          role="status"
          aria-live="polite"
        >
          {message ? (
            <p className="text-sm text-muted-foreground">{message}</p>
          ) : (
            <Badge variant="secondary" className="text-sm">
              {dirty ? (
                "Unsaved changes"
              ) : (
                <>
                  <Check className="size-3" />
                  All changes saved
                </>
              )}
            </Badge>
          )}
        </div>
      </section>
    </>
  );
}
