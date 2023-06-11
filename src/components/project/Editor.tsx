import { useCallback, useRef } from "react";
import { Button } from "@mui/material";
import { TabPanel } from "@mui/lab";
import { ViewUpdate, EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { createTheme } from "@uiw/codemirror-themes";

import { useAppDispatch, useDirectory } from "@/hooks";
import { File, updateFileAsync } from "@/stores/directory";
import { languages } from "@/components/common/extMapping";
import { myTheme } from "@/components/common/theme";
import Breadcrumbs from "./Breadcrumbs";

interface EditorProps {
    itemId: string;
}
// let editorRenders = new Map<string, number>();
export const Editor = ({ itemId }: EditorProps) => {
    const dispatch = useAppDispatch();

    const {
        item,
        path: [path, _],
    } = useDirectory(itemId);
    const { name, content, extension } = item as File;
    const inputRef = useRef<string>(content);

    const theme = createTheme(myTheme);
    const extensions: Extension[] = [EditorView.lineWrapping];
    const lang = loadLanguage(languages[extension]);
    if (lang) extensions.push(lang);

    // const count = editorRenders.get(itemId) ?? 0;
    // editorRenders.set(itemId, count + 1);
    // console.log(`editor re-rendered [${itemId}]: ${editorRenders.get(itemId)}`);

    const handleChange = useCallback(
        (value: string, _viewUpdate: ViewUpdate) => {
            inputRef.current = value;
        },
        []
    );

    const handleSave = () => {
        if (inputRef.current !== content) {
            console.log(`saving file: [${itemId}]`);
            dispatch(updateFileAsync({ itemId, content: inputRef.current }));
        }
    };

    return (
        <TabPanel
            value={itemId}
            onBlur={() => {
                console.log(`event on blur: ${itemId}`);
            }}
        >
            <Breadcrumbs path={path} />
            <Button variant="contained" onClick={handleSave}>
                Save
            </Button>
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
