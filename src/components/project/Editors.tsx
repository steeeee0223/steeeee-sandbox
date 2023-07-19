import { MouseEvent, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { Box, IconButton, Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";

import { useAppDispatch, useAppSelector, useDirectory } from "@/hooks";
import { closeEditors, setEditor } from "@/stores/editor";

import { Editor } from "./Editor";
import { editorTabHeight, editorTabStyle } from "./styles";

export default function Editors() {
    const { editorIds, currentEditor } = useAppSelector(
        (state) => ({
            editorIds: state.editor.ids as string[],
            currentEditor: state.editor.currentEditor,
        }),
        shallowEqual
    );
    const { getItem } = useDirectory();
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
        <Box sx={{ maxWidth: "100%", typography: "body1" }}>
            {currentEditor ? (
                <TabContext value={currentEditor}>
                    <Box sx={editorTabStyle}>
                        <TabList
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            aria-label="tabs"
                            sx={{ fontSize: "small" }}
                        >
                            {editorIds.map((itemId) => {
                                const { name } = getItem(itemId);
                                return (
                                    <Tab
                                        label={name}
                                        key={itemId}
                                        value={itemId}
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
                                                    handleCloseEditor(e, itemId)
                                                }
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        }
                                        sx={{ minHeight: editorTabHeight }}
                                    />
                                );
                            })}
                        </TabList>
                    </Box>
                    {editorIds.map((itemId) => {
                        return <Editor key={itemId} itemId={itemId} />;
                    })}
                </TabContext>
            ) : (
                <Box
                    sx={{
                        ...editorTabStyle,
                        minHeight: editorTabHeight + 1,
                    }}
                />
            )}
        </Box>
    );
}
