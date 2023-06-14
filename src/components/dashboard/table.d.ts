interface TableData {
    projectId: string;
    name: string;
    tags: string[];
    createdBy: string;
    lastModifiedAt: string;
}

interface TableHeadCell {
    disablePadding: boolean;
    id: keyof TableData;
    label: string;
    align?: "left" | "center" | "right";
}

type Order = "asc" | "desc";

type SortFields = Extract<
    keyof TableData,
    "name" | "createdBy" | "lastModifiedAt"
>;

interface TableProps {
    numSelected: number;
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: SortFields
    ) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

interface TableToolbarProps {
    numSelected: number;
}
