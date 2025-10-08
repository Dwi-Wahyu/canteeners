import CustomerBottombar from "./customer-bottombar";
import CustomerTopbar from "./customer-topbar";

export default function ClientCustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full relative min-h-svh pt-12 pb-16">
      <CustomerTopbar />

      <div className="p-5 pt-6">{children}</div>

      <CustomerBottombar />
    </div>
  );
}
