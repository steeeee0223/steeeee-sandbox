import { MouseEvent, useCallback, useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { Box, IconButton, Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";

import {
    useAppDispatch,
    useAppSelector,
    AppDispatch,
    RootState,
} from "@/hooks";
import { getItem, toList } from "@/stores/directory";
import { closeEditors, setEditor } from "@/stores/editor";

import { Editor } from "./Editor";

export default function Editors() {
    const { editorIds, currentEditor, directory } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            // isLoggedIn: state.auth.isAuthenticated,
            editorIds: state.editor.ids,
            currentEditor: state.editor.currentEditor,
            directory: toList(state.directory),
        }),
        shallowEqual
    );
    const dispatch: AppDispatch = useAppDispatch();

    const [tabs, setTabs] = useState(editorIds);
    const [activeTab, setActiveTab] = useState(currentEditor);

    const handleChange = useCallback(
        (e: React.SyntheticEvent, editorId: string) => {
            e.preventDefault();
            setActiveTab(editorId);
            dispatch(setEditor(editorId));
        },
        []
    );

    const handleCloseEditor = useCallback((e: MouseEvent, editorId: string) => {
        e.stopPropagation();
        dispatch(closeEditors([editorId]));
    }, []);

    useEffect(() => {
        setTabs(editorIds);
        setActiveTab(currentEditor);
    }, [currentEditor, editorIds]);

    return (
        <>
            {activeTab && (
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
                                {tabs.map((editorId) => {
                                    const itemId = editorId as string;
                                    const { name } = getItem(directory, itemId);
                                    return (
                                        <Tab
                                            label={name}
                                            key={itemId}
                                            value={itemId}
                                            component="span"
                                            disableRipple
                                            iconPosition="end"
                                            icon={
                                                <IconButton
                                                    component="span"
                                                    sx={{
                                                        padding: 0,
                                                        fontSize: "inherit",
                                                    }}
                                                    onClick={(e) =>
                                                        handleCloseEditor(
                                                            e,
                                                            itemId
                                                        )
                                                    }
                                                >
                                                    <CloseIcon fontSize="inherit" />
                                                </IconButton>
                                            }
                                            sx={{ padding: "0px 10px" }}
                                        />
                                    );
                                })}
                            </TabList>
                        </Box>
                        {tabs.map((editorId) => {
                            const itemId = editorId as string;
                            return <Editor key={itemId} itemId={itemId} />;
                        })}
                    </TabContext>
                </Box>
            )}
        </>
    );
}
