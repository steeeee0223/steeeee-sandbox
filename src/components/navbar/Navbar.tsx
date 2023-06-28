import { useLocation } from "react-router-dom";
import { Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import AppBar from "./AppBar";
import { useAppContext } from "@/contexts/app";
import { appBarTitle, pathsWithoutSidebar } from "@/data";
import { useAppSelector, usePath } from "@/hooks";
import { shallowEqual } from "react-redux";
import { signOutAsync } from "@/stores/auth";

const Navbar = () => {
    const { sidebarOpen, setSidebarOpen } = useAppContext();
    const { user } = useAppSelector(
        (state) => ({ user: state.auth.user }),
        shallowEqual
    );
    const {
        path: [, path],
    } = usePath();

    return (
        <AppBar position="fixed" open={false}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => setSidebarOpen((prev) => !prev)}
                    edge="start"
                    sx={{ marginRight: 5 }}
                    disabled={pathsWithoutSidebar.includes(path)}
                >
                    {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1 }}
                >
                    {appBarTitle}
                </Typography>
                {user && <Button onClick={signOutAsync}>Sign Out</Button>}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
