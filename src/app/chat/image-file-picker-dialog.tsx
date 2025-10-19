import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { useState } from "react";
import { FileUploadImage } from "../_components/file-upload-image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadMedia } from "../_components/file-upload-media";

export function ImageFilePickerDialog() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon">
          <Image />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-start">
            Kirim Gambar
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>

          <div className="w-full">
            <FileUploadImage
              multiple={true}
              onFilesChange={(newFiles) => {
                setFiles(newFiles);
              }}
            />

            <Textarea
              className="field-sizing-content max-h-30 mt-4 min-h-0 resize-none py-1.75"
              placeholder="Keterangan"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction>Kirim</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
