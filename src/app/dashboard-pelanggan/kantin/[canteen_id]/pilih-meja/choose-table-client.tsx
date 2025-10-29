"use client";

import { Save, XCircle, Table, Loader } from "lucide-react";
import { useState } from "react";
import { getCanteenWithMapsAndTables } from "@/app/admin/kantin/queries";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { chooseCustomerTable } from "@/app/admin/kantin/[canteen_id]/qrcode-meja/[map_id]/actions";
import { toast } from "sonner";

interface SelectedTable {
  floor: number;
  table_number: number;
}

export default function ChooseTableClient({
  canteen,
  user_id,
  canteen_id,
}: {
  canteen: NonNullable<Awaited<ReturnType<typeof getCanteenWithMapsAndTables>>>;
  user_id: string;
  canteen_id: number;
}) {
  const [selectedTable, setSelectedTable] = useState<SelectedTable | null>(
    null
  );

  const defaultTab = canteen.maps[0]?.floor.toString() || "1";

  const [activeTab, setActiveTab] = useState(defaultTab);

  const [isLoading, setIsLoading] = useState(false);

  // Todo: handle ketika lantai dipilih dan meja dipilih tidak ada di lantai tersebut
  const handleTableChange = (floor: number, table_number: number) => {
    setSelectedTable({ floor, table_number: 1 });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectedTable) {
      const { floor, table_number } = selectedTable;

      const result = await chooseCustomerTable({
        canteen_id,
        floor,
        table_number,
        user_id,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error.message);
      }
    } else {
      console.log("Belum ada meja yang dipilih.");
    }

    setIsLoading(false);
  };

  const isSaveDisabled = selectedTable === null;

  return (
    <form onSubmit={handleSave} className="mt-4 max-w-lg mx-auto">
      <div className="flex flex-col">
        <Tabs defaultValue={defaultTab} onValueChange={setActiveTab}>
          <TabsList className="w-full py-6">
            {canteen.maps.map((map, i) => (
              <TabsTrigger
                key={i}
                className="py-5"
                value={map.floor.toString()}
              >
                Lantai {map.floor.toString()}
              </TabsTrigger>
            ))}
          </TabsList>

          {canteen.maps.map((map, i) => {
            const floorKey = map.floor.toString();
            return (
              <TabsContent key={i} value={floorKey} className="mt-2">
                <div className="grid grid-cols-2 gap-4">
                  {map.qrcodes.map((table) => {
                    const tableId = `radio-table-${map.floor}-${table.table_number}`;

                    const isChecked =
                      selectedTable?.floor === map.floor &&
                      selectedTable?.table_number === table.table_number;

                    return (
                      <Item
                        key={tableId}
                        variant={"outline"}
                        onClick={() =>
                          handleTableChange(map.floor, table.table_number)
                        }
                        className={`${
                          isChecked ? "bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        <ItemContent>
                          <ItemTitle>
                            <label
                              htmlFor={tableId}
                              className={`cursor-pointer`}
                            >
                              Meja {table.table_number}
                            </label>
                          </ItemTitle>
                        </ItemContent>
                        <ItemActions>
                          <input
                            type="radio"
                            id={tableId}
                            name="selected_table"
                            value={`${map.floor}-${table.table_number}`}
                            checked={isChecked}
                            onChange={() =>
                              handleTableChange(map.floor, table.table_number)
                            }
                            hidden
                            onClick={(e) => e.stopPropagation()}
                          />
                        </ItemActions>
                      </Item>
                    );
                  })}
                </div>

                {map.qrcodes.length === 0 && (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia>
                        {/* Mengganti IconQrcodeOff dengan XCircle dari Lucide */}
                        <XCircle size={60} className="text-gray-400" />
                      </EmptyMedia>
                      <EmptyTitle>Meja Belum Ditambahkan</EmptyTitle>
                      <EmptyDescription>
                        Sabar yaa, kami masih bikin qrcodenya
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isSaveDisabled || isLoading}
          size={"lg"}
        >
          {isLoading ? <Loader className="animate-spin" /> : <Save />}
          Simpan Pilihan Meja
        </Button>
      </div>
    </form>
  );
}
