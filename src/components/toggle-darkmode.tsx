"use client";

import { useState } from "react";

import { SunIcon, MoonIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTheme } from "next-themes";

export function ToggleDarkMode() {
  const { setTheme } = useTheme();
  const [isDark, setIsDark] = useState(true);

  function handleToggle() {
    setIsDark(!isDark);

    setTheme(isDark ? "light" : "dark");
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle dark mode"
      className="p-3 rounded-full"
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
