import { Link as RouterLink } from "react-router-dom";
import { Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import AppBar from "./AppBar";
import { useAppContext } from "@/contexts/app";
import { appBarTitle, pathsWithoutSidebar } from "@/data";
import { useAppDispatch, useAuth, usePath } from "@/hooks";
import { signOutAsync } from "@/stores/auth";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const { sidebarOpen, setSidebarOpen } = useAppContext();
    const { user } = useAuth();
    const {
        path: [, path],
    } = usePath();

    return (
        <AppBar position="fixed" open={false}>
            <Toolbar>
                {!pathsWithoutSidebar.includes(path) && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        edge="start"
                        sx={{ marginRight: 5 }}
                    >
                        {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                )}
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1, fontWeight: "bold" }}
                >
                    {appBarTitle}
                </Typography>
                {path === "" && (
                    <Button component={RouterLink} to="/login">
                        Sign In
                    </Button>
                )}
                {user && (
                    <Button onClick={() => dispatch(signOutAsync())}>
                        Sign Out
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
