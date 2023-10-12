import { useCallback, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";

import { languages, loadExtensions } from "@/lib/editor";
import { myTheme } from "./theme";

export interface CodeEditorProps {
    name: string;
    language: string;
    value: string;
    readOnly: boolean;
}

export default function CodeEditor(props: CodeEditorProps) {
    const { value, readOnly, language } = props;
    console.log(
        `Setting editor language: ${language} => ${languages[language]}`
    );
    const theme = createTheme(myTheme);
    const extensions = loadExtensions(language);
    const ref = useRef<string>(value);
    const handleChange = useCallback(
        (value: string) => {
            ref.current = value;
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
