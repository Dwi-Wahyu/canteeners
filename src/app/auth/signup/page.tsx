import { SignupForm } from "../signup-form";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="border flex size-6 items-center justify-center rounded-md">
            <Image
              src={"/app-logo.svg"}
              width={16}
              height={16}
              alt="app-logo"
            />
          </div>
          Canteneers.
        </a>
        <SignupForm />
      </div>
    </div>
  );
}
