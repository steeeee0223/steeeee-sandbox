import { ChangeEvent, MouseEvent, useState } from "react";

import { getComparator, stableSort } from "@/lib/table";
import { Project } from "@/types";

import { useProjects } from "./projects";

export function useTable() {
    const { projects } = useProjects();

    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<SortFields>("name");
    const [selected, setSelected] = useState<readonly string[]>([]);
    const [page, setPage] = useState(0);
    const rowsPerPageOptions = [5, 10, 15];
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const normalize = (project: Project): TableData => ({
        ...project,
        createdBy: project.createdBy.displayName ?? "unknown",
        lastModifiedAt: new Date(project.lastModifiedAt).toLocaleString(),
    });
    const tableData = projects.map(normalize);

    const handleRequestSort = (
        event: MouseEvent<unknown>,
        property: SortFields
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = projects.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: MouseEvent<HTMLElement>, name: string) => {
        console.log(`project ${name} is clicked`);
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (
        event: MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - projects.length) : 0;

    const visibleRows = stableSort(
        tableData,
        getComparator(order, orderBy)
    ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return {
        emptyRows,
        order,
        orderBy,
        page,
        rowsPerPage,
        rowsPerPageOptions,
        selected,
        tableData,
        visibleRows,
        handleChangePage,
        handleChangeRowsPerPage,
        handleClick,
        handleRequestSort,
        handleSelectAllClick,
        isSelected,
    };
}
