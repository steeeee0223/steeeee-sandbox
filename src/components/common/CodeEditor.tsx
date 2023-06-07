import { useCallback, useRef, useState } from "react";
import { ViewUpdate, EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { createTheme } from "@uiw/codemirror-themes";

import { myTheme } from "./theme";
import { languages } from "./extMapping";

export interface CodeEditorProps {
    name: string;
    language: string;
    value: string;
    readOnly: boolean;
}

export default function CodeEditor(props: CodeEditorProps) {
    const { value, readOnly, language } = props;
    // const [code, setCode] = useState(value);
    console.log(
        `Setting editor language: ${language} => ${languages[language]}`
    );
    const theme = createTheme(myTheme);
    const extensions: Extension[] = [EditorView.lineWrapping];
    const lang = loadLanguage(languages[language]);
    if (lang) extensions.push(lang);
    // const handleChange = useCallback(
    //     (value: string, _viewUpdate: ViewUpdate) => {
    //         setCode(value);
    //     },
    //     []
    // );

    const ref = useRef<string>(value);
    const handleChange = useCallback(
        (value: string, _viewUpdate: ViewUpdate) => {
            // setCode(value);
            // console.log(value);
            ref.current = value;
            console.log(ref.current);
        },
        [ref]
    );

    return (
        <CodeMirror
            itemRef={ref.current}
            className="code-mirror-wrapper"
            value={ref.current}
            theme={theme}
            extensions={extensions}
            {...(readOnly ? { readOnly } : { onChange: handleChange })}
        />
    );
}
