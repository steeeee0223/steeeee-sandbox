import { MouseEvent, useCallback, useMemo } from "react";
import { Box, IconButton, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { ViewUpdate } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import createTheme from "@uiw/codemirror-themes";
import { useSandpack } from "@codesandbox/sandpack-react";

import { useDirectory, useEditors, useKeyPress } from "@/hooks";
import { loadExtensions } from "@/lib/editor";
import { editorTabHeight, editorTabStyle } from "./styles";
import { myTheme } from "../common/theme";
import Breadcrumbs from "./Breadcrumbs";

const EditorPanel = ({ editorId }: { editorId: string }) => {
    const {
        sandpack: { updateFile },
    } = useSandpack();

    const { getInfo, save, currentText, updateText, updatePreview } =
        useEditors();
    const { extension } = getInfo(editorId);
    const { getPath } = useDirectory();
    const [name] = getPath(editorId);

    const theme = createTheme(myTheme);
    const extensions = useMemo(() => loadExtensions(extension), [extension]);

    const handleEditorChange = useCallback(
        (value: string, viewUpdate: ViewUpdate) => {
            updateText(value);
            console.log(`[Panel] Changed value for [${editorId}]`);
        },
        []
    );

    const handleSave = () => {
        console.log(`[Panel] saving text: [${editorId}] => ${currentText}`);
        save(editorId);
        updatePreview(editorId, updateFile);
    };

    useKeyPress({ meta: ["s"], ctrl: ["s"] }, handleSave);

    return (
        <TabPanel value={editorId} style={{ padding: 0 }}>
            <Breadcrumbs path={name} />
            <CodeMirror
                value={currentText}
                extensions={extensions}
                autoFocus
                theme={theme}
                onChange={handleEditorChange}
                height="100vh"
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
        <Box sx={{ maxWidth: "100%", typography: "body1" }}>
            {currentEditor ? (
                <TabContext value={currentEditor}>
                    <Box sx={editorTabStyle}>
                        <TabList
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
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
