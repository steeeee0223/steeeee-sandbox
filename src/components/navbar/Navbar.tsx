import { Link as RouterLink } from "react-router-dom";
import { Toolbar, IconButton, Typography, Button, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import AppBar from "./AppBar";
import { useAppContext } from "@/contexts/app";
import { appBarTitle } from "@/data";
import { useAuth, usePath } from "@/hooks";

const Navbar = () => {
    const { sidebarOpen, setSidebarOpen } = useAppContext();
    const { user, signOut } = useAuth();
    const { isPageWithSidebar, isHomePage } = usePath();

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
                {isHomePage && (
                    <Stack direction="row" spacing={1}>
                        <Button href="#features">Features</Button>
                        <Button href="#contact">Contact</Button>
                        <Button component={RouterLink} to="/login">
                            Sign In
                        </Button>
                    </Stack>
                )}
                {user && (
                    <Stack direction="row" spacing={1}>
                        <Button component={RouterLink} to="/home">
                            Home
                        </Button>
                        <Button onClick={signOut}>Sign Out</Button>
                    </Stack>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
