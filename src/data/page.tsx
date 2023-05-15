import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SourceIcon from "@mui/icons-material/Source";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

import { DrawerItem } from "@/components/sidebar";

export const appBarTitle = "Steeeee";

export const list1: DrawerItem[] = [
    { name: "Home", icon: <HomeIcon />, href: "/" },
    { name: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
];

/**
 * temparory
 */
export const list2: DrawerItem[] = [
    { name: "Project", icon: <SourceIcon />, href: "/project/1" },
    { name: "Demo", icon: <ViewInArIcon />, href: "/demo/1" },
];
