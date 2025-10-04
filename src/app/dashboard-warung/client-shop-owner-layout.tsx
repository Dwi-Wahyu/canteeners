import OwnerBottomBar from "./owner-bottombar";
import OwnerTopbar from "./owner-topbar";

export default function ClientShopOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-svh relative pb-14">
      <div className="p-5 pl-4">
        {/* <OwnerTopbar /> */}

        {children}
      </div>

      <OwnerBottomBar />
    </div>
  );
}
