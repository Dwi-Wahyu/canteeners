import { useQueryState } from "nuqs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

export function FilterKeterangan({
  keteranganList,
  clearSignal,
}: {
  keteranganList: string[];
  clearSignal: number;
}) {
  const [keterangan, setKeterangan] = useQueryState("keterangan", {
    shallow: false,
    clearOnDefault: true,
    defaultValue: "",
  });

  useEffect(() => {
    setKeterangan("");
  }, [clearSignal]);

  return (
    <>
      <Select onValueChange={setKeterangan} defaultValue={keterangan}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter Keterangan" />
        </SelectTrigger>
        <SelectContent>
          {keteranganList.map((keterangan, idx) => (
            <SelectItem value={keterangan} key={idx}>
              {keterangan}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
