"use client";

import { useQuery } from "@tanstack/react-query";
import { getShops } from "./queries-action";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function KedaiPage() {
  const { data, isLoading, error, isLoadingError } = useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
  });

  return (
    <div className="container max-w-7xl mx-auto">
      <h1 className="font-semibold text-lg mb-4">Daftar Kedai</h1>

      {isLoading && <div>Loading . . .</div>}

      {!isLoading && isLoadingError && <div>Error</div>}

      {!isLoading && !isLoadingError && data && (
        <div className="grid grid-cols-3 gap-4">
          {data.map((kedai, idx) => (
            <Link key={idx} href={`/admin/kedai/${kedai.id}`}>
              <Card>
                <CardContent>
                  <h1>{kedai.name}</h1>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
