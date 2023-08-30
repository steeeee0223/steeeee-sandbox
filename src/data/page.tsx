import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PublicIcon from "@mui/icons-material/Public";
import SettingsIcon from "@mui/icons-material/Settings";

import { DrawerItem } from "@/components/sidebar";

export const appBarTitle = "Steeeee Sandbox";

export const pathsWithoutSidebar = ["", "login"];

export const list1: DrawerItem[] = [
    { name: "Home", icon: <HomeIcon />, href: "/home" },
    { name: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
];

export const list2: DrawerItem[] = [
    { name: "Playground", icon: <SportsEsportsIcon />, href: "/playground" },
    { name: "Discover", icon: <PublicIcon />, href: "/discover" },
    { name: "Settings", icon: <SettingsIcon />, href: "/settings" },
];
