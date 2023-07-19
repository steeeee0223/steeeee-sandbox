import { useCallback, useRef } from "react";
import { TabPanel } from "@mui/lab";
import { ViewUpdate, EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { createTheme } from "@uiw/codemirror-themes";
import { useSandpack } from "@codesandbox/sandpack-react";

import { useAppDispatch, useDirectory, useKeyPress } from "@/hooks";
import { File, updateFileAsync } from "@/stores/directory";
import { languages } from "@/components/common/extMapping";
import { myTheme } from "@/components/common/theme";
import Breadcrumbs from "./Breadcrumbs";

interface EditorProps {
    itemId: string;
}

export const Editor = ({ itemId }: EditorProps) => {
    const dispatch = useAppDispatch();
    const {
        sandpack: { updateFile },
    } = useSandpack();

    const { projectId, getItem, getPath } = useDirectory();
    const [path, _] = getPath(itemId);
    const { content, extension } = getItem(itemId) as File;

    const inputRef = useRef<string>(content);

    const theme = createTheme(myTheme);
    const extensions: Extension[] = [EditorView.lineWrapping];
    const lang = loadLanguage(languages[extension]);
    if (lang) extensions.push(lang);

    const handleChange = useCallback(
        (value: string, _viewUpdate: ViewUpdate) => {
            inputRef.current = value;
        },
        []
    );

    const handleSave = useCallback(() => {
        if (projectId && inputRef.current !== content) {
            console.log(`saving file: [${itemId}]`);
            dispatch(
                updateFileAsync({
                    projectId,
                    itemId,
                    content: inputRef.current,
                })
            );
            const pathname = path.join("/").slice(4);
            updateFile(pathname, inputRef.current, true);
        }
    }, []);

    useKeyPress({ meta: ["s"], ctrl: ["s"] }, handleSave);

    return (
        <TabPanel
            value={itemId}
            onBlur={() => {
                console.log(`event on blur: ${itemId}`);
            }}
            sx={{ p: 0 }}
        >
            <Breadcrumbs path={path} />
            <CodeMirror
                className="code-mirror-wrapper"
                value={inputRef.current}
                theme={theme}
                extensions={extensions}
                onChange={handleChange}
            />
        </TabPanel>
    );
};
