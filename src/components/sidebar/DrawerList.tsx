import * as React from "react";
import {
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

export type DrawerItem = {
    name: string;
    icon: React.ReactElement;
    href: string;
};

interface DrawerListProps {
    open: boolean;
    data: DrawerItem[];
}

export default function DrawerList({ open, data }: DrawerListProps) {
    return (
        <List>
            {data.map(({ name, icon, href }, index) => (
                <ListItem key={index} disablePadding sx={{ display: "block" }}>
                    <Link href={href} underline="none">
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                {icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={name}
                                sx={{
                                    opacity: open ? 1 : 0,
                                    color: "gray",
                                }}
                            />
                        </ListItemButton>
                    </Link>
                </ListItem>
            ))}
        </List>
    );
}
