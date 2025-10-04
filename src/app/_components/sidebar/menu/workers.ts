import {
  IconChartDots3,
  IconLogout2,
  IconPasswordUser,
} from "@tabler/icons-react";

import {
  HouseWifi,
  LayoutDashboard,
  ListTodo,
  LogOut,
  UserCircle,
} from "lucide-react";

export const workersMenu = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Task Anda",
      url: "/admin/task-anda",
      icon: ListTodo,
    },
  ],
  navProject: [
    {
      title: "FTTH",
      url: "/admin/projects/ftth",
      icon: HouseWifi,
      child: [
        {
          title: "Summary",
          url: "/admin/projects/ftth/summary",
        },
        {
          title: "Detailed",
          url: "/admin/projects/ftth",
        },
      ],
    },
    {
      title: "Backbone",
      url: "/admin/projects/backbone",
      icon: IconChartDots3,
      child: [
        {
          title: "Summary",
          url: "/admin/projects/backbone/summary",
        },
        {
          title: "Detailed",
          url: "/admin/projects/backbone",
        },
      ],
    },
  ],
  navUser: [],
  navSetting: [
    {
      title: "Profil",
      url: "/admin/profil",
      icon: UserCircle,
    },
    {
      title: "Ganti Password",
      url: "/admin/ganti-password",
      icon: IconPasswordUser,
    },
    {
      title: "Logout",
      url: "/admin/logout",
      icon: IconLogout2,
    },
  ],
};
