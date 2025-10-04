import OwnerBottomBar from "./owner-bottombar";

export default function ClientShopOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-svh relative pb-14">
      <div className="p-5">
        {/* <OwnerTopbar /> */}

        {children}
      </div>

      <OwnerBottomBar />
    </div>
  );
}
