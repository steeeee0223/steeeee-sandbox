import React, { useState } from "react";
import { Box, Tab as MuiTab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export type TabInfo = {
    id: string;
    label: string;
    icon?: React.ReactElement;
    component: React.ReactNode;
};

export interface TabsProps {
    children: TabInfo[];
    defaultValue: string;
}

export default function Tabs({ children, defaultValue }: TabsProps) {
    const [value, setValue] = useState(defaultValue);
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        console.log(`new val ${newValue}`);
        setValue(newValue);
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
                        sx={{ fontSize: "small" }}
                    >
                        {children.map(({ label, icon, id }) => (
                            <MuiTab
                                label={label}
                                value={id}
                                key={id}
                                {...(icon && {
                                    icon,
                                    iconPosition: "end",
                                    component: "span",
                                    disableRipple: true,
                                })}
                            />
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
