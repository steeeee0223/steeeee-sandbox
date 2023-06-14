export const tableTitle = "Projects";

function createData(
    projectId: string,
    name: string,
    tags: string[],
    createdBy: string
): TableData {
    return {
        projectId,
        name,
        tags,
        createdBy,
        lastModifiedAt: new Date().toTimeString(),
    };
}

export const tableRows: TableData[] = [
    createData("1", "Cupcake", ["python"], "steve"),
    createData("2", "Donut", ["python"], "steve"),
    createData("3", "Eclair", ["python"], "steve"),
    createData("4", "Frozen yoghurt", ["python"], "steve"),
    createData("5", "Gingerbread", ["nodejs"], "steve"),
    createData("6", "Honeycomb", ["react"], "kimi"),
    createData("7", "Ice cream sandwich", ["react"], "kimi"),
    createData("8", "Jelly Bean", ["react"], "kimi"),
    createData("9", "KitKat", ["react"], "kimi"),
    createData("10", "Lollipop", ["react"], "kimi"),
    createData("11", "Marshmallow", ["php"], "kimi"),
    createData("12", "Nougat", ["php"], "kimi"),
    createData("13", "Oreo", ["php"], "kimi"),
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
