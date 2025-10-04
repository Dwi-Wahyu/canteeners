import { validate } from "uuid";

// Helper function to generate breadcrumbs from path
export function generateBreadcrumbs(
  pathname: string
): { label: string; href: string }[] {
  const breadcrumbs: { label: string; href: string }[] = [];

  // Kasus khusus untuk halaman root publik
  if (pathname === "/") {
    breadcrumbs.push({ label: "Home", href: "/" });
    return breadcrumbs;
  }

  // Selalu mulai dengan "Home" yang mengarah ke "/admin" (Dashboard)
  breadcrumbs.push({ label: "Home", href: "/admin" });

  if (pathname === "/admin") {
    return breadcrumbs;
  }

  const segments = pathname.split("/").filter(Boolean);
  let currentPath = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    // Jika segmen pertama adalah "admin", lewati karena sudah diwakili oleh "Home"
    if (segment === "admin" && i === 0) {
      currentPath = "/admin";
      continue;
    }

    currentPath += `/${segment}`;
    let label = "";

    // Deteksi segmen khusus seperti create, edit, atau ID
    if (segment === "create") {
      label = `Input`;
    } else if (segment === "edit") {
      label = `Edit`;
    } else if (!isNaN(Number(segment))) {
      label = `Detail`;
    } else {
      // Ubah format string (misalnya, 'kesegaran-jasmani' menjadi 'Kesegaran Jasmani')
      label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    if (validate(segment) || !isNaN(parseInt(segment))) {
      continue;
    }

    breadcrumbs.push({ label, href: currentPath });
  }

  return breadcrumbs;
}
