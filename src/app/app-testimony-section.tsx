import { Card, CardContent } from "@/components/ui/card";
import { AppTestimony } from "./generated/prisma";

export default function AppTestimonySection({
  data,
}: {
  data: AppTestimony[];
}) {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-primary">Apa Kata Mereka?</h3>
          <p className="mt-3 text-xl">
            Pengalaman pengguna dan pemilik warung di Canteeners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <TestimonialCard
            name="Risa Adelia"
            role="Mahasiswi Teknik, Pengunjung Kantin"
            quote="Dulu selalu stres kalau kantin lagi ramai, harus teriak-teriak pesan. Sekarang tinggal scan, pesan, dan tunggu di meja. Waktu istirahat jadi lebih tenang dan efektif. Canteeners benar-benar Kantin Naik Level!"
          />

          {data.map((testimony) => (
            <Card
              key={testimony.id}
              className="rounded-xl shadow-lg transition duration-300 hover:shadow-xl flex flex-col h-full"
            >
              <CardContent className="flex flex-col justify-between">
                <p className="text-xl italic mb-4 flex-grow line-clamp-4">
                  "{testimony.message}"
                </p>
                <div className="pt-4">
                  <p className="font-semibold">{testimony.from}</p>
                  <p className="text-sm text-primary font-medium">
                    {testimony.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const TestimonialCard = ({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) => (
  <Card className="rounded-xl shadow-lg transition duration-300 hover:shadow-xl flex flex-col h-full">
    <CardContent className="flex flex-col justify-between">
      <p className="text-xl italic mb-4 flex-grow">"{quote}"</p>
      <div className="pt-4">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-primary font-medium">{role}</p>
      </div>
    </CardContent>
  </Card>
);
