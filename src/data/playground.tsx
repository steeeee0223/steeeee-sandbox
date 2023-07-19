import { SandpackFiles } from "@codesandbox/sandpack-react";

export const sampleTemplate = "react-ts";
export const sampleSetup = {
    dependencies: { "react-markdown": "latest" },
};

export const sampleFiles: SandpackFiles = {
    "/TextArea.tsx": `import {useState, useRef} from 'react'
import ReactMarkdown from 'react-markdown' 

export const TextArea = () => {
    const [text, setText] = useState('# Hello, *world*!')
    return (
    <ReactMarkdown onChange={() => setText(text)}>
        {text}
    </ReactMarkdown>
    )
}`,

    "/Button.tsx": `import {useState} from "react"
export const Button = () => {
    const [count, setCount] = useState(0)
    return <>
        <h3>Current count: {count}</h3>
        <button onClick={() => setCount(count+1)}>Add one</button>
    </>
}`,
    "/App.tsx": {
        code: `import {Button} from "./Button"
import {TextArea} from "./TextArea"

export default function App() {
    return <>
        <h1>Hello world</h1>
        <Button/>
        <TextArea/>
    </>
    }`,
    },
};
