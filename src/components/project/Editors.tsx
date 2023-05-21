import { MouseEvent, useState } from "react";
import { shallowEqual } from "react-redux";
import { IconButton, Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";

import {
    useAppDispatch,
    useAppSelector,
    AppDispatch,
    RootState,
} from "@/hooks";
import { CodeEditor } from "@/components/common";
import { closeEditor } from "@/stores/files";
import { ProjectStorage } from "@/lib/projectStorage";
import { File } from "./FolderSystem";

export default function Editors() {
    const { fileState } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            // isLoggedIn: state.auth.isAuthenticated,
            fileState: state.files,
        }),
        shallowEqual
    );
    const dispatch: AppDispatch = useAppDispatch();
    const project = new ProjectStorage(fileState);

    const [value, setValue] = useState<string | null>(null);
    const handleChange = (
        event: React.SyntheticEvent,
        newValue: string | null
    ) => {
        console.log(`new val ${newValue}`);
        setValue(newValue);
    };

    const handleCloseEditor = (itemId: string) => (e: MouseEvent) => {
        dispatch(closeEditor(itemId));
    };

    const tabs = fileState.editors.map((itemId) => {
        const file = project.getFile(itemId) ?? (undefined as never);
        const { title, extension, content } = file as File;
        return {
            itemId,
            title,
            extension,
            content,
        };
    });

    return (
        <>
            {tabs.length > 0 && (
                <Box sx={{ maxWidth: "100%", typography: "body1" }}>
                    <TabContext
                        value={
                            (fileState.currentEditor || value) ??
                            (null as never)
                        }
                    >
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
                                {tabs.map(({ title, itemId }) => (
                                    <Tab
                                        component="span"
                                        label={title}
                                        value={itemId}
                                        key={itemId}
                                        iconPosition="end"
                                        disableRipple
                                        icon={
                                            <IconButton
                                                sx={{
                                                    padding: 0,
                                                    fontSize: "small",
                                                }}
                                                onClick={handleCloseEditor(
                                                    itemId
                                                )}
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        }
                                    />
                                ))}
                            </TabList>
                        </Box>
                        {tabs.map(({ title, extension, content, itemId }) => (
                            <TabPanel value={itemId} key={itemId}>
                                <CodeEditor
                                    name={title}
                                    language={extension}
                                    value={content}
                                    readOnly={false}
                                />
                            </TabPanel>
                        ))}
                    </TabContext>
                </Box>
            )}
        </>
    );
}
