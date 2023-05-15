import { useEffect, useState } from "react";

export interface FrameProps {
    code: string;
}

export default function Frame({ code }: FrameProps) {
    const [doc, setDoc] = useState<string>("");

    useEffect(() => {
        setDoc(`
        <!DOCTYPE html>
        <html>
        <body>
        <div id="root">Hello</div>
        <script type="module">
        </script>
      </body>
        </html>`);
    }, [code]);

    return (
        <iframe
            srcDoc={doc}
            title="output"
            sandbox="allow-scripts"
            width="100%"
            height="100%"
        />
    );
}
