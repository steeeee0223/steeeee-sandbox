import { Box, Tab, Tabs as MuiTabs } from "@mui/material";
import * as React from "react";
import { TabsProps } from "../common";

interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: string) {
    return {
        key: index,
        value: index,
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function Tabs({ children, defaultValue, onChange }: TabsProps) {
    const [value, setValue] = React.useState(defaultValue);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    React.useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <MuiTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    {children.map(({ label, icon, id }) => (
                        <Tab
                            label={label}
                            {...a11yProps(id)}
                            {...(icon && {
                                icon,
                                iconPosition: "end",
                                component: "span",
                                disableRipple: true,
                            })}
                        />
                    ))}
                </MuiTabs>
            </Box>
            {children.map(({ component, id }) => (
                <TabPanel value={value} index={id} key={id}>
                    {component}
                </TabPanel>
            ))}
        </Box>
    );
}
