import * as React from "react";
import { Box, Container, CssBaseline } from "@mui/material";

import Base from "./Base";
import { DrawerHeader } from "@/components/sidebar";

export default function BasePage({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Base />
            <Box component="main" sx={{ flexGrow: 1, p: 2, bgcolor: "#ccc" }}>
                <DrawerHeader />
                <Container
                    sx={{
                        minHeight: "100vh",
                        width: "100%",
                        border: 0,
                        flexGrow: 1,
                    }}
                >
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
