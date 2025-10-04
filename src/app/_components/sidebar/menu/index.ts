import { adminMenu } from "./admin";
import { workersMenu } from "./workers";

export function getSidebarMenu(role: string) {
  switch (role) {
    case "workers":
      return workersMenu;
    case "admin":
      return adminMenu;
    default:
      return adminMenu;
  }
}
