import {
    Box,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
} from "@mui/material";

import { useAppSelector, useProjects, useTable } from "@/hooks";
import TableHeader from "./TableHeader";
import TableToolbar from "./TableToolbar";
import { ActionToolbar } from "./Toolbars";
import { shallowEqual } from "react-redux";
import RenameForm from "./RenameForm";

export default function EnhancedTable() {
    const { currentProject } = useProjects();
    const {
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
    } = useTable();

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750, alignContent: "center" }}
                        aria-labelledby="tableTitle"
                        stickyHeader
                    >
                        <TableHeader
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={tableData.length}
                        />
                        <TableBody>
                            {visibleRows.map((tableRow) => {
                                const {
                                    projectId,
                                    name,
                                    tags,
                                    createdBy,
                                    lastModifiedAt,
                                } = tableRow;
                                const isItemSelected = isSelected(name);
                                const labelId = `enhanced-table-checkbox-${projectId}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) =>
                                            handleClick(event, name)
                                        }
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={projectId}
                                        selected={isItemSelected}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    "aria-labelledby": labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {shallowEqual(currentProject, {
                                                action: "rename",
                                                id: projectId,
                                            }) ? (
                                                <RenameForm
                                                    projectId={projectId}
                                                    placeholder={name}
                                                />
                                            ) : (
                                                <>{name}</>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {tags.toString()}
                                        </TableCell>
                                        <TableCell align="center">
                                            {createdBy}
                                        </TableCell>
                                        <TableCell align="right">
                                            {lastModifiedAt}
                                        </TableCell>
                                        <TableCell align="center">
                                            <ActionToolbar
                                                projectName={name}
                                                projectId={projectId}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="div"
                    count={tableData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
