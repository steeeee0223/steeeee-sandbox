import { ReactElement, forwardRef } from "react";
import {
    Link as RouterLink,
    LinkProps as RouterLinkProps,
} from "react-router-dom";
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import { useAppContext } from "@/contexts/app";

interface ListItemLinkProps {
    icon?: ReactElement;
    name: string;
    href: string;
}

const Link = forwardRef<HTMLAnchorElement, RouterLinkProps>(function Link(
    props,
    ref
) {
    return <RouterLink ref={ref} {...props} role={undefined} />;
});

export default function ListItemLink({ icon, name, href }: ListItemLinkProps) {
    const { sidebarOpen } = useAppContext();

    return (
        <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
                LinkComponent={Link}
                href={href}
                sx={{
                    minHeight: 48,
                    justifyContent: sidebarOpen ? "initial" : "center",
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 3 : "auto",
                        justifyContent: "center",
                    }}
                >
                    {icon}
                </ListItemIcon>
                <ListItemText
                    primary={name}
                    sx={{ opacity: sidebarOpen ? 1 : 0 }}
                />
            </ListItemButton>
        </ListItem>
    );
}
