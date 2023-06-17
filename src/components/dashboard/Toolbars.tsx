import { MouseEvent, useRef } from "react";
import { shallowEqual } from "react-redux";
import { Modal, Paper, ToggleButton, Tooltip } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import DeleteIcon from "@mui/icons-material/Delete";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { ProjectAction, setProject } from "@/stores/project";
import { setDashboardAction } from "@/stores/cursor";

import { ButtonGroup } from "../common";
import CreateForm from "./CreateForm";
import DeleteForm from "./DeleteForm";

interface ToolbarProps {
    projectName: string;
    projectId: string;
}

export const ActionToolbar = ({ projectName, projectId }: ToolbarProps) => {
    const dispatch = useAppDispatch();
    const { currentProject } = useAppSelector(
        (state) => ({
            currentProject: state.project.currentProject,
        }),
        shallowEqual
    );

    const deleteFormRef = useRef<HTMLFormElement>(null);

    const handleActionChange = (
        e: MouseEvent<HTMLElement>,
        action: ProjectAction
    ) => {
        e.stopPropagation();
        const validActions: (string | null)[] = ["rename", "delete"];
        if (validActions.includes(action)) {
            dispatch(setProject({ action, id: projectId }));
        }
    };

    return (
        <Paper elevation={0} sx={{ border: null }}>
            <ButtonGroup
                onChange={handleActionChange}
                size="small"
                exclusive
                aria-label="project-actions"
            >
                <Tooltip title="Edit project">
                    <ToggleButton
                        href={`/project/${projectId}`}
                        value="edit"
                        aria-label="edit"
                    >
                        <CodeIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
                <Tooltip title="Demo project">
                    <ToggleButton
                        href={`/demo/${projectId}`}
                        value="demo"
                        aria-label="demo"
                    >
                        <ViewInArIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
                <Tooltip title="Rename project">
                    <ToggleButton value="rename" aria-label="rename">
                        <EditIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
                <Tooltip title="Delete project">
                    <ToggleButton value="delete" aria-label="delete">
                        <DeleteIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
            </ButtonGroup>
            <Modal
                open={shallowEqual(currentProject, {
                    action: "delete",
                    id: projectId,
                })}
                onClose={() => dispatch(setDashboardAction(null))}
            >
                <DeleteForm
                    projectName={projectName}
                    projectId={projectId}
                    ref={deleteFormRef}
                />
            </Modal>
        </Paper>
    );
};

export const HeaderToolbar = () => {
    const dispatch = useAppDispatch();
    const { dashboardAction } = useAppSelector((state) => ({
        dashboardAction: state.cursor.dashboardAction,
    }));

    const formRef = useRef<HTMLFormElement>(null);

    const handleFormOpen = () => {
        dispatch(setDashboardAction("create"));
    };

    const handleFormClosed = () => {
        dispatch(setDashboardAction(null));
    };

    return (
        <Paper elevation={0} sx={{ border: null }}>
            <ButtonGroup size="small" exclusive aria-label="project-actions">
                <Tooltip title="New project">
                    <ToggleButton
                        onClick={handleFormOpen}
                        value="create"
                        aria-label="create"
                    >
                        <FiberNewIcon />
                    </ToggleButton>
                </Tooltip>
                <Tooltip title="Filter list">
                    <ToggleButton value="filter" aria-label="filter">
                        <FilterListIcon />
                    </ToggleButton>
                </Tooltip>
            </ButtonGroup>
            <Modal
                open={dashboardAction === "create"}
                onClose={handleFormClosed}
                aria-labelledby="modal-title"
            >
                <CreateForm ref={formRef} />
            </Modal>
        </Paper>
    );
};
