import {
    angular,
    astro,
    nextjs,
    node,
    reactImage,
    solid,
    svelte,
    typescript,
    vanillajs,
    vite,
    vue,
} from "@/assets";
import type { Project, PredefinedTemplate } from "@/types";
import { sampleUser } from "./user";

type Template = {
    value: PredefinedTemplate;
    label: string;
    image?: string;
};

export const tableTitle = "Projects";

function createData(
    projectId: string,
    name: string,
    template: Template
): Project {
    return {
        projectId,
        name,
        tags: [template.label],
        template: template.value,
        createdBy: sampleUser,
        lastModifiedAt: new Date().toString(),
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
    { value: "static", label: "Blank", image: vanillajs },
    { value: "angular", label: "Angular", image: angular },
    { value: "solid", label: "Solid", image: solid },
    { value: "test-ts", label: "Test Typescript", image: typescript },
    { value: "vanilla", label: "Vanilla", image: vanillajs },
    { value: "vanilla-ts", label: "Vanilla Typescript", image: typescript },
    { value: "node", label: "NodeJS", image: node },
    { value: "nextjs", label: "Next.js", image: nextjs },
    { value: "vite", label: "Vite", image: vite },
    { value: "vite-react", label: "React", image: reactImage },
    { value: "vite-react-ts", label: "React Typescript", image: reactImage },
    { value: "vite-vue", label: "Vue", image: vue },
    { value: "vite-vue-ts", label: "Vue Typescript", image: vue },
    { value: "vite-svelte", label: "Svelte", image: svelte },
    { value: "vite-svelte-ts", label: "Svelte Typescript", image: svelte },
    { value: "astro", label: "Astro", image: astro },
];

export const sampleProjects: Project[] = [
    createData("1", "Sample React", projectTemplates[9]),
    createData("2", "Sample Node", projectTemplates[6]),
    createData("3", "Sample React Typescript", projectTemplates[10]),
];
