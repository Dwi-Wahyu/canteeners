import OwnerTopbar from "./owner-topbar";

export default function ClientShopOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <div className="p-5 pl-4">
        <OwnerTopbar />

        {children}
      </div>
    </main>
  );
}
