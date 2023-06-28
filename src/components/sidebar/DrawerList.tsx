import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
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
    listItems: DrawerItem[];
}

export default function DrawerList({ open, listItems }: DrawerListProps) {
    return (
        <List>
            {listItems.map(({ name, icon, href }, index) => (
                <ListItem key={index} disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                        }}
                        component={RouterLink}
                        to={href}
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
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}
