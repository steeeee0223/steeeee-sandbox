import { PropsWithChildren, useMemo } from "react";
import createTheme, { CreateThemeOptions } from "@uiw/codemirror-themes";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";

import { loadExtensions } from "@/lib/editor";
import style from "./CodeBlock.module.css";
import { myTheme } from "./CodeBlock.theme";

export type CodeBlockProps = {
    title?: string;
    language: string;
    content: string;
    readOnly: boolean;
    onChange?: ReactCodeMirrorProps["onChange"];
    theme?: CreateThemeOptions;
    className?: string;
    height?: string;
};

const TitleWrapper = ({
    title,
    children,
}: PropsWithChildren<{ title?: string }>) => {
    return title ? (
        <div className={style.editorContainer}>
            <div className={style.editorTitle}>{title}</div>
            {children}
        </div>
    ) : (
        <>{children}</>
    );
};

export default function CodeBlock({
    title,
    content,
    language,
    readOnly,
    onChange,
    theme,
    height,
}: CodeBlockProps) {
    const _theme = createTheme(theme ?? myTheme);
    const extensions = useMemo(() => loadExtensions(language), [language]);

    return (
        <TitleWrapper title={title}>
            <CodeMirror
                value={content}
                extensions={extensions}
                autoFocus
                readOnly={readOnly}
                onChange={onChange}
                theme={_theme}
                height={height}
            />
        </TitleWrapper>
    );
}
