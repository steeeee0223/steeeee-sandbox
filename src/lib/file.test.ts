import { getContent, getDefaultFile, getExtension } from "./file";

describe(getExtension.name, () => {
    it.each([
        { filename: "App.tsx", expected: "tsx" },
        { filename: "App.test.tsx", expected: "tsx" },
        { filename: ".env", expected: "" },
    ])(
        "Extension of $filename should be $expected",
        ({ filename, expected }) => {
            const result = getExtension(filename);
            console.log(result);
            expect(result).toEqual(expected);
        }
    );
});

describe(getDefaultFile.name, () => {
    it.each<{ filename: string; content?: string }>([
        { filename: "App.tsx", content: "App" },
        { filename: "App.test.tsx" },
    ])(
        "Created filename should be $filename, with content: $content",
        async ({ filename, content }) => {
            const result = getDefaultFile(filename, content);
            expect(result.name).toEqual(filename);
            const resContent = await getContent(result);
            expect(resContent).toEqual(content ?? "");
        }
    );
});
