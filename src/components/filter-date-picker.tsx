"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  label?: string;
  placeholder?: string;
  date: Date | null;
  setDate: (
    date: Date | null | ((old: Date | null) => Date | null)
  ) => Promise<URLSearchParams>;
};

export function FilterDatePicker({
  label,
  placeholder = "Pilih tanggal",
  date,
  setDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <Label htmlFor="date" className="px-1 text-muted-foreground">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            captionLayout="dropdown"
            onSelect={async (selectedDate) => {
              if (selectedDate) {
                setDate(toUtcMidnight(selectedDate));
                setOpen(false);
              } else {
                setDate(null);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function toUtcMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}
