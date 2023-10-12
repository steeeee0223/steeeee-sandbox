import { useState } from "react";
import { Box, Tab as MuiTab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { tabStyle } from "./styles";

export default function Viewer() {
    const [activeTab] = useState("0");

    const handleChange = () => console.log(`[Tab] Viewer2 tab clicked!`);

    return (
        <Box sx={{ maxWidth: "100%", typography: "body1" }}>
            <TabContext value={activeTab}>
                <Box sx={tabStyle}>
                    <TabList
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        aria-label="tabs"
                        sx={{ fontSize: "small" }}
                    >
                        <MuiTab label="Terminal" value="0" />
                    </TabList>
                </Box>

                <TabPanel value="0" sx={{ p: 0 }}>
                    <Typography
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        Terminal
                    </Typography>
                </TabPanel>
            </TabContext>
        </Box>
    );
}
