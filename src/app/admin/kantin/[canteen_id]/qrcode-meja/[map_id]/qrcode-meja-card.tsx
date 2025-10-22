import { TableQRCode } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconDownload } from "@tabler/icons-react";
import Link from "next/link";

export default function QRCodeMejaCard({ data }: { data: TableQRCode }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 items-center">
        <div className="justify-between flex items-center w-full">
          <h1 className="font-semibold">Meja {data.table_number}</h1>

          <Button variant={"outline"} size={"icon"} asChild>
            <Link
              href={"/uploads/table-qrcode/" + data.image_url}
              target="_blank"
            >
              <IconDownload />
            </Link>
          </Button>
        </div>

        <img src={"/uploads/table-qrcode/" + data.image_url} alt="" />
      </CardContent>
    </Card>
  );
}
