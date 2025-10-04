import CustomerTopbar from "./customer-topbar";

export default function ClientCustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full relative min-h-svh pt-14">
      <CustomerTopbar />

      <div className="p-5">{children}</div>
    </div>
  );
}
