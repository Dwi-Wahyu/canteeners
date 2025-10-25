"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { IconDownload } from "@tabler/icons-react";

import { ChevronLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DenahCard({
  floor,
  image_url,
  table_count,
}: {
  floor: number;
  image_url: string;
  table_count: number;
}) {
  return (
    <Card className="max-w-md pt-0">
      <CardContent className="px-0">
        <Dialog>
          <DialogTrigger>
            <img
              src={"/uploads/map/" + image_url}
              alt="Banner"
              className="aspect-video h-70 rounded-t-xl shadow object-cover"
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lantai {floor}</DialogTitle>
              <DialogDescription></DialogDescription>

              <img
                src={"/uploads/map/" + image_url}
                alt="Banner"
                className="aspect-video h-70 rounded-t-xl shadow object-cover"
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardHeader>
        <CardTitle>Lantai {floor}</CardTitle>
        <CardDescription>Jumlah Meja {table_count}</CardDescription>
      </CardHeader>
      <CardFooter className="gap-3 max-sm:flex-col max-sm:items-stretch">
        <Button>Lihat Daftar Kedai</Button>

        <Button variant={"outline"}>
          <IconDownload />
          Download Denah
        </Button>
      </CardFooter>
    </Card>
  );
}
