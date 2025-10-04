import { Card, CardContent } from "@/components/ui/card";
import { CustomIconProps } from "@/types/icon";

export default function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactElement<CustomIconProps>;
}) {
  return (
    <Card className="rounded-xl">
      <CardContent className="flex justify-between">
        <div>
          <h1 className="text-sm text-muted-foreground">{title}</h1>

          <h1 className="font-semibold text-lg">{value}</h1>
        </div>

        <div>{icon}</div>
      </CardContent>
    </Card>
  );
}
