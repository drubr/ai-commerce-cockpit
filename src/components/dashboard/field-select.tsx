import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { targetFields } from "@/lib/mappings";
export function FieldSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <Select
      items={[
        { value: "", label: "Not mapped" },
        ...targetFields.map((value) => ({ value, label: value })),
      ]}
      value={value}
      onValueChange={(value) => onChange(value ?? "")}
    >
      <SelectTrigger aria-label={label} className="w-full bg-white text-sm">
        <SelectValue placeholder="Select target field" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Not mapped</SelectItem>
        {targetFields.map((field) => (
          <SelectItem key={field} value={field}>
            {field}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
