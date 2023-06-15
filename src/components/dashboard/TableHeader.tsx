import * as React from "react";
import { visuallyHidden } from "@mui/utils";
import {
    Box,
    Checkbox,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from "@mui/material";

import { headCells } from "@/data";
import { isSortField } from "@/lib/table";

export default function TableHeader(props: TableProps) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler =
        (property: SortFields) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all desserts",
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => {
                    const { id, align, disablePadding, label } = headCell;
                    return (
                        <TableCell
                            key={id}
                            align={align}
                            padding={disablePadding ? "none" : "normal"}
                            sortDirection={orderBy === id ? order : false}
                        >
                            {isSortField(id) ? (
                                <TableSortLabel
                                    active={orderBy === id}
                                    direction={orderBy === id ? order : "asc"}
                                    onClick={createSortHandler(id)}
                                >
                                    {label}
                                    {orderBy === id ? (
                                        <Box
                                            component="span"
                                            sx={visuallyHidden}
                                        >
                                            {order === "desc"
                                                ? "sorted descending"
                                                : "sorted ascending"}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            ) : (
                                <>{label}</>
                            )}
                        </TableCell>
                    );
                })}
                <TableCell align="center" padding="normal">
                    Actions
                </TableCell>
            </TableRow>
        </TableHead>
    );
}
