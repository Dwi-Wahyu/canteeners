import { FilterDatePicker } from "@/components/filter-date-picker";
import { Input } from "@/components/ui/input";
import { parseAsIsoDate, useQueryState } from "nuqs";
import { FilterKeterangan } from "./filter-keterangan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FunnelX } from "lucide-react";

type Props = {
  nameFilter?: boolean;
  dateFilter?: boolean;
  keteranganFilter?: boolean;
  keteranganList?: string[];
};

export function DatatableBasicFilter({
  nameFilter = true,
  dateFilter = false,
  keteranganFilter = false,
  keteranganList,
}: Props) {
  const [nama, setNama] = useQueryState("nama", {
    shallow: false,
    clearOnDefault: true,
    defaultValue: "",
  });

  const [date, setDate] = useQueryState("tanggal", {
    shallow: false,
    clearOnDefault: true,
    ...parseAsIsoDate,
  });

  const [keterangan, setKeterangan] = useQueryState("keterangan", {
    shallow: false,
    clearOnDefault: true,
    defaultValue: "",
  });

  function handleClear() {
    setNama("");
    setDate(null);
    setKeterangan("");
  }

  return (
    <div className="flex gap-2 items-center ">
      {nameFilter && (
        <Input
          placeholder="Cari Nama . . ."
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
      )}

      {dateFilter && (
        <FilterDatePicker
          placeholder="Filter Tanggal"
          date={date}
          setDate={setDate}
        />
      )}

      {keteranganList && (
        <Select
          onValueChange={setKeterangan}
          required={false}
          defaultValue={keterangan}
        >
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
      )}

      <Button variant={"outline"} onClick={handleClear}>
        <FunnelX />
      </Button>
    </div>
  );
}
