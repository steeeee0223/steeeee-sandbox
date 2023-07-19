import React, { useEffect, useState } from "react";
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
    onChange?: (newValue: string) => void;
}

export default function Tabs({ children, defaultValue, onChange }: TabsProps) {
    const [tabs, setTabs] = useState<TabInfo[]>(children);
    const [activeTab, setActiveTab] = useState(defaultValue);
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    useEffect(() => {
        setTabs(children);
        setActiveTab(defaultValue);
    }, [defaultValue, children]);

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
                        {tabs.map(({ label, icon, id }) => (
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
                {tabs.map(({ component, id }) => (
                    <TabPanel value={id} key={id} sx={{ p: 0 }}>
                        {component}
                    </TabPanel>
                ))}
            </TabContext>
        </Box>
    );
}
