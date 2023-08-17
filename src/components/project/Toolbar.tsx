import { MouseEvent } from "react";
import { shallowEqual } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Divider, Paper, ToggleButton, Tooltip } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

import { useAppDispatch, useAppSelector, useDirectory } from "@/hooks";
import { CreationType, setCreation, setFileAction } from "@/stores/cursor";
import { drawerWidth } from "@/theme";
import { ButtonGroup } from "@/components/common";

import CreateForm from "./CreateForm";

export default function Toolbar() {
    const { fileActionType, creationType } = useAppSelector(
        (state) => ({
            fileActionType: state.cursor.fileActionType,
            creationType: state.cursor.creationType,
        }),
        shallowEqual
    );
    const dispatch = useAppDispatch();
    const { currentItem, project } = useDirectory();

    const handleCreation = (
        e: MouseEvent<HTMLElement>,
        newCreation: CreationType
    ) => {
        e.preventDefault();
        dispatch(setCreation(newCreation));
    };

    const handleFileAction = (
        e: MouseEvent<HTMLElement>,
        newCreation: string
    ) => {
        e.preventDefault();
        dispatch(setFileAction(newCreation));
    };

    return (
        <div>
            <Paper
                elevation={0}
                sx={{
                    display: "flex",
                    border: null,
                    flexWrap: "wrap",
                    width: drawerWidth,
                    marginBottom: 0,
                }}
            >
                <ButtonGroup size="small" exclusive>
                    <Tooltip title="Demo project">
                        <ToggleButton
                            component={RouterLink}
                            to={`/demo/${project.projectId}`}
                            value="demo"
                            aria-label="demo"
                            size="small"
                        >
                            <ViewInArIcon fontSize="small" />
                        </ToggleButton>
                    </Tooltip>
                </ButtonGroup>
                <Divider
                    flexItem
                    orientation="vertical"
                    sx={{ mx: 0.5, my: 1, ml: "1px", mr: "1px" }}
                />
                <ButtonGroup
                    size="small"
                    value={fileActionType}
                    exclusive
                    onChange={handleFileAction}
                    aria-label="saving"
                >
                    <ToggleButton value="save" aria-label="save">
                        <SaveIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="copy" aria-label="copy">
                        <ContentCopyIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="download" aria-label="download">
                        <DownloadIcon fontSize="small" />
                    </ToggleButton>
                </ButtonGroup>
                <Divider
                    flexItem
                    orientation="vertical"
                    sx={{ mx: 0.5, my: 1, ml: "1px", mr: "1px" }}
                />
                <ButtonGroup
                    size="small"
                    value={creationType}
                    exclusive
                    onChange={handleCreation}
                    aria-label="creating"
                    disabled={!currentItem.item.isFolder}
                >
                    <Tooltip title="Create folder">
                        <ToggleButton value="folder" aria-label="folder">
                            <FolderIcon fontSize="small" />
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip title="Create file">
                        <ToggleButton value="file" aria-label="file">
                            <InsertDriveFileIcon fontSize="small" />
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip title="Upload files">
                        <ToggleButton value="upload" aria-label="upload">
                            <CloudUploadIcon fontSize="small" />
                        </ToggleButton>
                    </Tooltip>
                </ButtonGroup>
                {creationType && (
                    <CreateForm
                        itemId={currentItem.item.id}
                        type={creationType}
                    />
                )}
            </Paper>
        </div>
    );
}
