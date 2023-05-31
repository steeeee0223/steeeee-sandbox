export const tableTitle = "Projects";

function createData(
    name: string,
    tags: string[],
    createdBy: string
): TableData {
    return {
        name,
        tags,
        createdBy,
        lastModifiedAt: new Date().toTimeString(),
        actions: ["edit", "demo"],
    };
}

export const tableRows: TableData[] = [
    createData("Cupcake", ["python"], "steve"),
    createData("Donut", ["python"], "steve"),
    createData("Eclair", ["python"], "steve"),
    createData("Frozen yoghurt", ["python"], "steve"),
    createData("Gingerbread", ["nodejs"], "steve"),
    createData("Honeycomb", ["react"], "kimi"),
    createData("Ice cream sandwich", ["react"], "kimi"),
    createData("Jelly Bean", ["react"], "kimi"),
    createData("KitKat", ["react"], "kimi"),
    createData("Lollipop", ["react"], "kimi"),
    createData("Marshmallow", ["php"], "kimi"),
    createData("Nougat", ["php"], "kimi"),
    createData("Oreo", ["php"], "kimi"),
];

export const headCells: readonly TableHeadCell[] = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "Project Name",
    },
    {
        id: "tags",
        numeric: true,
        disablePadding: false,
        label: "Tags",
    },
    {
        id: "createdBy",
        numeric: true,
        disablePadding: false,
        label: "Created By",
    },
    {
        id: "lastModifiedAt",
        numeric: true,
        disablePadding: false,
        label: "Last Modified At",
    },
    {
        id: "actions",
        numeric: true,
        disablePadding: false,
        label: "Actions",
    },
];
