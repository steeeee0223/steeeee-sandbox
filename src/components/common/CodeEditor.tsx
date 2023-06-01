import { useCallback, useState } from "react";
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
    const [code, setCode] = useState(value);
    console.log(
        `Setting editor language: ${language} => ${languages[language]}`
    );
    const theme = createTheme(myTheme);
    const extensions: Extension[] = [EditorView.lineWrapping];
    const lang = loadLanguage(languages[language]);
    if (lang) extensions.push(lang);
    const handleChange = (value: string, _viewUpdate: ViewUpdate) => {
        setCode(value);
    };

    return (
        <CodeMirror
            className="code-mirror-wrapper"
            value={code}
            theme={theme}
            extensions={extensions}
            {...(readOnly ? { readOnly } : { onChange: handleChange })}
        />
    );
}
