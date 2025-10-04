"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SonnerDemo() {
  function showSuccess() {
    toast.success("Login Berhasil");
  }

  function showError() {
    toast.error("Event has not been created");
  }

  function showInfo() {
    toast.info("Be at the area 10 minutes before the event time");
  }

  function showWarning() {
    toast.warning("Event start time cannot be earlier than 8am");
  }

  return (
    <div>
      <h1>Demo Sonner</h1>

      <Button onClick={showSuccess} variant={"success"}>
        Sukses
      </Button>
      <Button onClick={showError} variant={"destructive"}>
        Error
      </Button>
      <Button onClick={showInfo} variant={"default"}>
        Info
      </Button>
      <Button onClick={showWarning} variant={"secondary"}>
        Warning
      </Button>
    </div>
  );
}
