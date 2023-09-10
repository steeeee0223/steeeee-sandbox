import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

export const navbarHeight = "64px";
export const drawerWidth = 240;
export const containerHeight = `calc(100vh - ${navbarHeight})`;

export const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#fff",
            dark: "#fff",
        },
        secondary: {
            main: "#b8b8b8",
            dark: "#b8b8b8",
        },
        text: {
            primary: "#fff",
            secondary: grey[300],
            disabled: grey[500],
        },
        background: {
            default: "#121212",
            paper: "#121212",
        },
        divider: grey[700],
        action: {
            active: "#fff",
            hover: grey[800],
            hoverOpacity: 0.1,
            selected: "#222222",
            selectedOpacity: 0.1,
            disabled: grey[500],
            disabledOpacity: 0.08,
            disabledBackground: grey[800],
            focus: grey[50],
            focusOpacity: 0.08,
            activatedOpacity: 0.08,
        },
    },
});
