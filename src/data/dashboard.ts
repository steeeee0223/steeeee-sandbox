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
    {
        value: "vite-react",
        label: "React",
    },
    {
        value: "vite-react-ts",
        label: "React Typescript",
    },
    {
        value: "node",
        label: "NodeJS",
    },
    {
        value: "static",
        label: "Blank",
    },
];

export const tableRows: Project[] = [
    createData("1", "React", projectTemplates[0], "admin"),
    createData("2", "Node", projectTemplates[2], "admin"),
    createData("3", "React Typescript", projectTemplates[1], "admin"),
];
