import { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";

import { Project } from "@/stores/project";

type Template = {
    value: SandpackPredefinedTemplate;
    label: string;
};

export const tableTitle = "Projects";

function createData(
    projectId: string,
    name: string,
    template: Template,
    createdBy: string
): Project {
    return {
        projectId,
        name,
        tags: [template.label],
        template: template.value,
        createdBy: { uid: createdBy, displayName: createdBy, email: "" },
        lastModifiedAt: new Date(),
    };
}

export const headCells: readonly TableHeadCell[] = [
    {
        id: "name",
        align: "left",
        disablePadding: true,
        label: "Project Name",
    },
    {
        id: "tags",
        align: "center",
        disablePadding: false,
        label: "Tags",
    },
    {
        id: "createdBy",
        align: "center",
        disablePadding: false,
        label: "Created By",
    },
    {
        id: "lastModifiedAt",
        align: "right",
        disablePadding: false,
        label: "Last Modified At",
    },
];

export const projectTemplates: Template[] = [
    { value: "static", label: "Blank" },
    { value: "angular", label: "Angular" },
    { value: "solid", label: "Solid" },
    { value: "test-ts", label: "Test Typescript" },
    { value: "vanilla", label: "Vanilla" },
    { value: "vanilla-ts", label: "Vanilla Typescript" },
    { value: "node", label: "NodeJS" },
    { value: "nextjs", label: "Next.js" },
    { value: "vite", label: "Vite" },
    { value: "vite-react", label: "React" },
    { value: "vite-react-ts", label: "React Typescript" },
    { value: "vite-vue", label: "Vue" },
    { value: "vite-vue-ts", label: "Vue Typescript" },
    { value: "vite-svelte", label: "Svelte" },
    { value: "vite-svelte-ts", label: "Svelte Typescript" },
    { value: "astro", label: "Astro" },
];

export const tableRows: Project[] = [
    createData("1", "Sample React", projectTemplates[9], "admin"),
    createData("2", "Sample Node", projectTemplates[6], "admin"),
    createData("3", "Sample React Typescript", projectTemplates[10], "admin"),
];
