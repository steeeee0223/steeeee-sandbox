import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

import "@/App.css";
import { AppRoutes } from "@/Routes";
import { BasePage } from "@/pages";
import { theme } from "@/theme";
import { Navbar } from "@/components/navbar";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Navbar />
                <BasePage>
                    <AppRoutes />
                </BasePage>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
