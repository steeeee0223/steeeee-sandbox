import { ThemeProvider, CssBaseline } from "@mui/material";

import "@/App.css";
import { AppRoutes } from "@/Routes";
import { BasePage } from "@/pages";
import { theme } from "@/theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BasePage>
                <AppRoutes />
            </BasePage>
        </ThemeProvider>
    );
}

export default App;
