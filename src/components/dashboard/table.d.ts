interface TableData {
    name: string;
    tags: string[];
    createdBy: string;
    lastModifiedAt: Date;
    actions: string[];
}

interface TableHeadCell {
    disablePadding: boolean;
    id: keyof TableData;
    label: string;
    numeric: boolean;
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
