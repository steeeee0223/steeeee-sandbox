import { sampleFiles } from "@/data";
import { Sandpack, SandpackPreview } from "@codesandbox/sandpack-react";

export default function Playground() {
    return (
        <>
            <h1>Playground</h1>
            <Sandpack
                template="react-ts"
                customSetup={{
                    dependencies: {
                        "react-markdown": "latest",
                    },
                }}
                files={sampleFiles}
                options={{
                    autorun: false,
                    autoReload: false,
                    codeEditor: {},
                    editorHeight: 600,
                    editorWidthPercentage: 60,
                    showConsole: true,
                    showConsoleButton: true,
                    showInlineErrors: true,
                    showLineNumbers: true,
                    showNavigator: true,
                }}
            />
            {/* <SandpackPreview /> */}
        </>
    );
}
