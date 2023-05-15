import { CodeEditorProps, CodeEditor } from "@/components/common";

export default function CodeBlock(props: CodeEditorProps) {
    const { name } = props;
    return (
        <div className="editor-container">
            <div className="editor-title">{name}</div>
            <CodeEditor {...props} />
        </div>
    );
}
