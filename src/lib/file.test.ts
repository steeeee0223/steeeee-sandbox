import { $files, $folders, $projects } from "#/mock";
import { DirectoryItem, Project } from "@/types";
import {
    getContent,
    getDefaultFile,
    getExtension,
    getRefId,
    normalizePath,
} from "./file";

describe(getExtension, () => {
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

describe(getDefaultFile, () => {
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

describe(normalizePath, () => {
    it.each([
        {
            path: ["root", "components", "Button.tsx"],
            expected: "/components/Button.tsx",
        },
        { path: ["root", ".gitignore"], expected: "/.gitignore" },
    ])("Normalized path should be $expected", ({ path, expected }) => {
        const result = normalizePath(path);
        expect(result).toEqual(expected);
    });
});

describe(getRefId, () => {
    const project = $projects.one.state;
    const file = $files.one.state;
    const folder = $folders.one.state;

    it.each<{
        project: Project;
        item?: DirectoryItem;
        expected: string;
    }>([
        {
            project,
            expected: `${project.name}-${project.projectId}`,
        },
        {
            project,
            item: file,
            expected: `${project.name}-${project.projectId}/components/App.tsx`,
        },
        {
            project,
            item: folder,
            expected: `${project.name}-${project.projectId}/components`,
        },
    ])("Ref ID should be $expected", ({ project, item, expected }) => {
        const result = getRefId(project, item);
        expect(result).toEqual(expected);
    });
});
