import { Link as RouterLink } from "react-router-dom";
import { Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";

import AppBar from "./AppBar";
import { useAppContext } from "@/contexts/app";
import { appBarTitle } from "@/data";
import { useAuth, usePath } from "@/hooks";

const Navbar = () => {
    const { sidebarOpen, setSidebarOpen } = useAppContext();
    const { user, signOut } = useAuth();
    const { isPageWithSidebar, isLoginPage } = usePath();

    return (
        <AppBar position="fixed" open={false}>
            <Toolbar>
                {isPageWithSidebar && (
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
                {isLoginPage && (
                    <Button component={RouterLink} to="/login">
                        Sign In
                    </Button>
                )}
                {user && (
                    <>
                        <IconButton component={RouterLink} to="/home">
                            <HomeIcon />
                        </IconButton>
                        <Button onClick={signOut}>Sign Out</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
