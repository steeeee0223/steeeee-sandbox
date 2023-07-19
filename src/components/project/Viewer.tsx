import React, { useEffect, useState } from "react";
import { Box, Tab as MuiTab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useSandpack } from "@codesandbox/sandpack-react";

import { Preview } from "../common";

export default function Viewer() {
    const [activeTab, setActiveTab] = useState("0");
    const { dispatch } = useSandpack();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        if (newValue === "0") {
            dispatch({ type: "refresh" }); // does not work since sandpack is in idle mode
            console.log(`Refresing preview panel`);
        }
    };

    return (
        <Box sx={{ maxWidth: "100%", typography: "body1" }}>
            <TabContext value={activeTab}>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <TabList
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        aria-label="tabs"
                        sx={{ fontSize: "small" }}
                    >
                        <MuiTab label="Browser" value="0" />
                        <MuiTab label="Terminal" value="1" />
                    </TabList>
                </Box>
                <TabPanel value="0" sx={{ p: 0 }}>
                    <Preview />
                </TabPanel>
                <TabPanel value="1" sx={{ p: 0 }}>
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
