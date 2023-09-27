import { MouseEvent, useRef } from "react";
import { shallowEqual } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Modal, Paper, ToggleButton, Tooltip } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import { useAppDispatch, useAppSelector, useProjects } from "@/hooks";
import { ProjectAction } from "@/stores/project";
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
    const { currentProject, select, reset, download } = useProjects();

    const deleteFormRef = useRef<HTMLFormElement>(null);

    const handleActionChange = (
        e: MouseEvent<HTMLElement>,
        action: ProjectAction
    ) => {
        e.stopPropagation();
        switch (action) {
            case "rename":
                select(projectId, action);
                break;
            case "delete":
                select(projectId, action);
                break;
            case "download":
                download(projectId);
                break;
            default:
                break;
        }
    };

    const handleFormClosed = () => {
        reset();
        dispatch(setDashboardAction(null));
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
                        component={RouterLink}
                        to={`/project/${projectId}`}
                        value="edit"
                        aria-label="edit"
                    >
                        <CodeIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
                <Tooltip title="Demo project">
                    <ToggleButton
                        component={RouterLink}
                        to={`/demo/${projectId}`}
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
                <Tooltip title="Download project">
                    <ToggleButton value="download" aria-label="download">
                        <CloudDownloadIcon fontSize="small" />
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
                onClose={handleFormClosed}
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
