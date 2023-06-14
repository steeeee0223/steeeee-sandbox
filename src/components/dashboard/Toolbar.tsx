import { Paper, ToggleButton } from "@mui/material";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import EditIcon from "@mui/icons-material/Edit";

import { ButtonGroup } from "../common";

interface ToolbarProps {
    projectId: string;
}

export default function Toolbar({ projectId }: ToolbarProps) {
    return (
        <Paper elevation={0} sx={{ border: null }}>
            <ButtonGroup size="small" exclusive aria-label="project-actions">
                <ToggleButton
                    href={`/project/${projectId}`}
                    value="project"
                    aria-label="project"
                >
                    <EditIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton
                    href={`/demo/${projectId}`}
                    value="demo"
                    aria-label="demo"
                >
                    <ViewInArIcon fontSize="small" />
                </ToggleButton>
            </ButtonGroup>
        </Paper>
    );
}
