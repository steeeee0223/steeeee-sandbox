import { MouseEvent, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { Box, IconButton, Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";

import { useAppDispatch, useAppSelector, useDirectory } from "@/hooks";
import { getItem } from "@/stores/directory";
import { closeEditors, setEditor } from "@/stores/editor";

import { Editor } from "./Editor";

export default function Editors() {
    const { editorIds, currentEditor } = useAppSelector(
        (state) => ({
            editorIds: state.editor.ids,
            currentEditor: state.editor.currentEditor,
        }),
        shallowEqual
    );
    const { directory } = useDirectory("root");
    const dispatch = useAppDispatch();

    const handleChange = useCallback(
        (e: React.SyntheticEvent, editorId: string) => {
            e.preventDefault();
            dispatch(setEditor(editorId));
        },
        []
    );

    const handleCloseEditor = useCallback((e: MouseEvent, editorId: string) => {
        e.stopPropagation();
        dispatch(closeEditors([editorId]));
    }, []);

    return (
        <>
            {currentEditor && (
                <Box sx={{ maxWidth: "100%", typography: "body1" }}>
                    <TabContext value={currentEditor}>
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
                                {editorIds.map((editorId) => {
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
                        {editorIds.map((editorId) => {
                            const itemId = editorId as string;
                            return <Editor key={itemId} itemId={itemId} />;
                        })}
                    </TabContext>
                </Box>
            )}
        </>
    );
}
