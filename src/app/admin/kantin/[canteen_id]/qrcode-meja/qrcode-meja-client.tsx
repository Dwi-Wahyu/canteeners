import { getCanteenWithAllRelations } from "../../queries";

export default function QrcodeMejaClient({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getCanteenWithAllRelations>>>;
}) {
  return (
    <div>
      <h1>{data.name}</h1>
    </div>
  );
}
