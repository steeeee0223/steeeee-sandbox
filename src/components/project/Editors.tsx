import { MouseEvent, useCallback } from "react";
import { Box, IconButton, Stack, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { useSandpack } from "@codesandbox/sandpack-react";
import SaveIcon from "@mui/icons-material/Save";

import { Breadcrumbs, CodeBlock } from "@/components/common";
import { useDirectory, useEditors, useKeyPress } from "@/hooks";
import { containerHeight, theme } from "@/theme";
import {
    editorBoxHeight,
    editorPanelHeight,
    editorTabHeight,
    tabStyle,
} from "./styles";

const EditorPanel = ({ editorId }: { editorId: string }) => {
    const {
        sandpack: { updateFile },
    } = useSandpack();

    const { getInfo, save, currentText, updateText, updatePreview } =
        useEditors();
    const { extension } = getInfo(editorId);
    const { getPath } = useDirectory();
    const [name] = getPath(editorId);

    const handleEditorChange = useCallback((value: string) => {
        updateText(value);
        console.log(`[Panel] Changed value for [${editorId}]`);
    }, []);

    const handleSave = () => {
        console.log(`[Panel] saving text: [${editorId}] => ${currentText}`);
        save(editorId);
        updatePreview(editorId, updateFile);
    };

    useKeyPress({ meta: ["s"], ctrl: ["s"] }, handleSave);

    return (
        <TabPanel value={editorId} sx={{ padding: 0 }}>
            <Stack maxHeight={editorTabHeight} direction="row">
                <Breadcrumbs path={name} />
                <IconButton
                    onClick={handleSave}
                    size="small"
                    sx={{ m: 1, borderRadius: 1 }}
                >
                    <SaveIcon fontSize="small" />
                </IconButton>
            </Stack>
            <CodeBlock
                content={currentText}
                language={extension}
                readOnly={false}
                onChange={handleEditorChange}
                height={editorPanelHeight}
            />
        </TabPanel>
    );
};

export default function Editors() {
    const { editors, currentEditor, isModified, select, close } = useEditors();

    const handleTabChange = (e: React.SyntheticEvent, editorId: string) => {
        e.preventDefault();
        console.log(
            `[Editors] on tabs change: ${currentEditor} => ${editorId}`
        );
        select(editorId);
    };

    const handleCloseEditor = useCallback((e: MouseEvent, editorId: string) => {
        e.stopPropagation();
        close([editorId]);
    }, []);

    return (
        <Box
            sx={{
                maxHeight: containerHeight,
                maxWidth: "100%",
                typography: "body1",
            }}
        >
            {currentEditor ? (
                <TabContext value={currentEditor}>
                    <Box sx={tabStyle}>
                        <TabList
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            TabScrollButtonProps={{
                                sx: { color: theme.palette.secondary.main },
                            }}
                            aria-label="tabs"
                            sx={{ fontSize: "small" }}
                        >
                            {editors.map(({ id, name }) => (
                                <Tab
                                    label={
                                        isModified(id)
                                            ? `${name} (Modified)`
                                            : name
                                    }
                                    key={id}
                                    value={id}
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
                                                handleCloseEditor(e, id)
                                            }
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                    sx={{ minHeight: editorTabHeight }}
                                />
                            ))}
                        </TabList>
                    </Box>
                    <EditorPanel editorId={currentEditor} />
                </TabContext>
            ) : (
                <>
                    <Box
                        sx={{
                            ...tabStyle,
                            minHeight: editorTabHeight + 1,
                        }}
                    />
                    <Box sx={{ height: editorBoxHeight }} />
                </>
            )}
        </Box>
    );
}
