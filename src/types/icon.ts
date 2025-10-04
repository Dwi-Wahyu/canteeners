import { type Icon as TablerIcon } from "@tabler/icons-react";
import { LucideIcon } from "lucide-react";

export interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  isBreadcrumbLogo?: boolean;
}

type CustomIconComponent = React.ComponentType<CustomIconProps>;

export type IconType = TablerIcon | LucideIcon | CustomIconComponent;
