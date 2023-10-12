import { Sandpack } from "@codesandbox/sandpack-react";

import { sampleBundledFiles } from "@/data";

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
                files={sampleBundledFiles}
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
        </>
    );
}
