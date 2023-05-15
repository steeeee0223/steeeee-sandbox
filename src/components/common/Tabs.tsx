import React, { useState } from "react";
import { Box, Tab as MuiTab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export type TabInfo = {
    id: string;
    label: string;
    component: React.ReactNode;
};

export interface TabsProps {
    children: TabInfo[];
    defaultValue: string;
    onChange?: (value: string) => void;
}

export default function Tabs({ children, defaultValue, onChange }: TabsProps) {
    const [value, setValue] = useState(defaultValue);
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        if (onChange) onChange(newValue);
    };

    return (
        <Box sx={{ maxWidth: "100%", typography: "body1" }}>
            <TabContext value={value}>
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
                    >
                        {children.map(({ label, id }) => (
                            <MuiTab label={label} value={id} key={id} />
                        ))}
                    </TabList>
                </Box>
                {children.map(({ component, id }) => (
                    <TabPanel value={id} key={id}>
                        {component}
                    </TabPanel>
                ))}
            </TabContext>
        </Box>
    );
}
