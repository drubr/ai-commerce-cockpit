"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export function PasswordInput(
  props: Omit<React.ComponentProps<typeof Input>, "type">,
) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        autoComplete="current-password"
        {...props}
        type={visible ? "text" : "password"}
        className="h-11 pr-11"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1.5 right-1.5 text-muted-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible(!visible)}
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
