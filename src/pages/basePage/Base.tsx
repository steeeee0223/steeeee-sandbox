import * as React from "react";
import { shallowEqual } from "react-redux";
import {
    Button,
    Divider,
    IconButton,
    List,
    Toolbar as MuiToolbar,
    Typography,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { appBarTitle, list1, list2 } from "@/data";
import { useAppSelector } from "@/hooks";
import { AppBar } from "@/components/navbar";
import { FolderSystem, Toolbar } from "@/components/project";
import { Drawer, DrawerHeader, DrawerList } from "@/components/sidebar";

const Base = () => {
    const { currentProject } = useAppSelector(
        (state) => ({
            // user: state.auth.user,
            // isLoggedIn: state.auth.isAuthenticated,
            currentProject: state.project.currentProject,
        }),
        shallowEqual
    );

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
            <AppBar position="fixed" open={open}>
                <MuiToolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: "none" }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {appBarTitle}
                    </Typography>
                </MuiToolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                open={open}
                aria-label={currentProject?.id ?? undefined}
            >
                <DrawerHeader>
                    <Button href="/" size="large">
                        Home
                    </Button>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                {currentProject?.action === "edit" ? (
                    <>
                        <Toolbar />
                        <Divider />
                        <FolderSystem parent="root" />
                    </>
                ) : (
                    <>
                        <DrawerList open={open} data={list1} />
                        <Divider />
                        <List>
                            <DrawerList open={open} data={list2} />
                        </List>
                    </>
                )}
            </Drawer>
        </>
    );
};

export default Base;
