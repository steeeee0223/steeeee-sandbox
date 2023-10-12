import { SyntheticEvent, useState } from "react";
import { Box, Tab as MuiTab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
// import { useSandpack } from "@codesandbox/sandpack-react";

import { Preview } from "../common";
import { previewHeight, tabStyle } from "./styles";

export default function Viewer() {
    const [activeTab, setActiveTab] = useState("0");
    // const { dispatch } = useSandpack();

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        // dispatch({ type: "refresh" });
    };

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
                        <MuiTab label="Browser" value="0" />
                    </TabList>
                </Box>
                <TabPanel value="0" sx={{ p: 0 }}>
                    <Preview height={previewHeight} />
                </TabPanel>
            </TabContext>
        </Box>
    );
}
