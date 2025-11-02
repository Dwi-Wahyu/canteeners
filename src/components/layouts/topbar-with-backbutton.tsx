import BackButton from "@/app/_components/back-button";

export default function TopbarWithBackButton({
  title,
  backUrl,
}: {
  title: string;
  backUrl?: string;
}) {
  return (
    <div className="px-5 py-4 bg-background z-20 fixed top-0 left-0 shadow w-full justify-between flex items-center">
      <div className="flex items-center">
        <BackButton url={backUrl} />

        <h1 className="font-semibold text-lg">{title}</h1>
      </div>
    </div>
  );
}
