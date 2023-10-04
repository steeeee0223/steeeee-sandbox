import { File, Folder } from "@/stores/directory";

export const sampleCode = `import * as React, { useState } from "react"
const a = 1
/**
* User 
* @returns
*/
class User {
    public name!: string
    public count = 1
    public isValid: true | null = true
    constructor(...params: string[]) {
    
    }
}

function add(x: number): number {
    return x + 1 // add one
  }
const Component = () => {}

const App = () => {
    const user: User = {} as User
  const [count, setCount] = useState<number>(0)
  return <div>
  Header
    <Component className="app" count={count} />
  </div>
}`;
export const sampleFiles: File[] = [
    {
        parent: "components",
        itemId: "components-1",
        path: ["root"],
        isFolder: false,
        name: "App.tsx",
        desc: "Donec placein elit. Pellentesque convallis laoreet laoreet.",
        extension: "ts",
        content: sampleCode,
    },
    {
        parent: "components",
        itemId: "components-2",
        path: ["root"],
        isFolder: false,
        name: "Routes.tsx",
        desc: "Donec laoreet.",
        extension: "ts",
        content: "",
    },
];

export const sampleFolders: Folder[] = [
    {
        parent: "root",
        itemId: "components",
        path: ["root"],
        isFolder: true,
        name: "components",
        desc: "Donec placerat, lectus sed mat",
        children: sampleFiles,
    },
    {
        parent: "root",
        itemId: "assets",
        path: ["root"],
        isFolder: true,
        name: "assets",
    },
    {
        parent: "root",
        itemId: "pages",
        path: ["root"],
        isFolder: true,
        name: "pages",
        desc: "Donec placerat, lectus sed .",
    },
];
