import { Input } from "@/components/ui/input";
export function EmailInput(
  props: Omit<React.ComponentProps<typeof Input>, "type">,
) {
  return (
    <Input autoComplete="email" inputMode="email" {...props} type="email" />
  );
}
