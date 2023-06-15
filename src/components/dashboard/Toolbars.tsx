import {
    MouseEvent,
    MouseEventHandler,
    ReactElement,
    useRef,
    useState,
} from "react";
import { Modal, Paper, ToggleButton, Tooltip } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import DeleteIcon from "@mui/icons-material/Delete";

import { ButtonGroup } from "../common";
import CreateForm from "./CreateForm";

interface ToolbarProps {
    projectId: string;
}

export const ActionToolbar = ({ projectId }: ToolbarProps) => {
    const handleChange: MouseEventHandler = (e) => {
        e.stopPropagation();
    };

    return (
        <Paper elevation={0} sx={{ border: null }}>
            <ButtonGroup
                onChange={handleChange}
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
                <Tooltip title="Rename Project">
                    <ToggleButton value="rename" aria-label="rename">
                        <EditIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
                <Tooltip title="Delete Project">
                    <ToggleButton value="delete" aria-label="delete">
                        <DeleteIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
            </ButtonGroup>
        </Paper>
    );
};

export const HeaderToolbar = () => {
    const [createForm, setCreateForm] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleFormOpen = () => {
        setCreateForm(true);
    };

    const handleFormClosed = () => {
        setCreateForm(false);
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
                open={createForm}
                onClose={handleFormClosed}
                aria-labelledby="modal-title"
            >
                <CreateForm ref={formRef} />
            </Modal>
        </Paper>
    );
};
