import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectWithSearchProps {
  options: SelectOption[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

export function SelectWithSearch({
  options,
  placeholder = "Pilih...",
  onValueChange,
  defaultValue,
  disabled = false,
}: SelectWithSearchProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      setSearchValue("");
    }
  }, [open]);

  return (
    <Select
      onOpenChange={setOpen}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            ref={searchInputRef}
            placeholder="Cari..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full"
          />
        </div>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))
        ) : (
          <div className="p-2 text-center text-sm text-gray-500">
            Tidak ada hasil.
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
