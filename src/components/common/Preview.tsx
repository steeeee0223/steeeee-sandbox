import { useEffect } from "react";
import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";

interface PreviewProps {
    height?: string;
}

export default function Preview({ height }: PreviewProps) {
    const { listen } = useSandpack();

    useEffect(() => {
        // listens for any message dispatched between sandpack and the bundler
        // const stopListening = listen((msg) => console.log(msg));
        const stopListening = listen(() => {});

        return () => {
            /** unsubscribe */
            stopListening();
        };
    }, [listen]);

    return (
        <SandpackPreview
            showNavigator
            showRefreshButton
            showOpenInCodeSandbox={false}
            style={{ borderLeft: 1, borderColor: "divider", height }}
        />
    );
}
