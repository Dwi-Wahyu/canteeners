"use client";

import { useEffect, useState } from "react";

import { ChevronDownIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate, formatDateWithoutYear } from "@/helper/date-helper";

export function RangeDatePickerWithoutYear({
  range,
  setRange,
}: {
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
}) {
  return (
    <div className="w-full ">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-full bg-card justify-between font-normal"
          >
            {range?.from && range?.to
              ? `${formatDateWithoutYear(range.from)} - ${formatDateWithoutYear(
                  range.to
                )}`
              : "Pilih rentang tanggal"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(range) => {
              setRange(range);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
