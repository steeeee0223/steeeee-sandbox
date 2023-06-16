import { Project } from "@/stores/project";

export const tableTitle = "Projects";

function createData(
    projectId: string,
    name: string,
    tags: string[],
    createdBy: string
): Project {
    return {
        projectId,
        name,
        tags,
        createdBy,
        lastModifiedAt: new Date(),
    };
}

export const tableRows: Project[] = [
    createData("1", "Typescript", ["typescript"], "admin"),
    createData("2", "Node JS", ["nodejs"], "steve"),
    createData("3", "Python", ["python"], "kimi"),
    createData("4", "C++", ["c++"], "kimi"),
];

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

export const projectTemplates = [
    {
        value: "React",
        label: "React",
    },
    {
        value: "Python",
        label: "Python",
    },
    {
        value: "C++",
        label: "C++",
    },
    {
        value: "NodeJs",
        label: "NodeJs",
    },
    {
        value: "Blank",
        label: "Blank",
    },
];
