import { MouseEvent } from "react";
import { shallowEqual } from "react-redux";
import { Divider, Paper, ToggleButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

import {
    useAppDispatch,
    useAppSelector,
    AppDispatch,
    RootState,
} from "@/hooks";
import { setCreation, setFileAction } from "@/stores/cursor";
import { drawerWidth } from "@/theme";
import { ButtonGroup } from "@/components/common";
import CreateFolder from "./CreateFolder";
import CreateFile from "./CreateFile";
import UploadForm from "./UploadForm";

export default function Toolbar() {
    const { fileActionType, creationType, currentItem, projectId } =
        useAppSelector(
            (state: RootState) => ({
                fileActionType: state.cursor.fileActionType,
                creationType: state.cursor.creationType,
                currentItem: state.directory.currentItem,
                projectId: state.project.currentProject?.id,
            }),
            shallowEqual
        );
    const dispatch: AppDispatch = useAppDispatch();

    const handleCreation = (
        e: MouseEvent<HTMLElement>,
        newCreation: string
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

    const Form = () => {
        switch (creationType) {
            case "createFolder":
                return <CreateFolder />;
            case "createFile":
                return <CreateFile />;
            case "upload":
                return <UploadForm />;
            default:
                return <></>;
        }
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
                    <ToggleButton
                        size="small"
                        href={`/demo/${projectId}`}
                        value="demo"
                        aria-label="demo"
                    >
                        <ViewInArIcon fontSize="small" />
                    </ToggleButton>
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
                    <ToggleButton
                        value="createFolder"
                        aria-label="createFolder"
                    >
                        <FolderIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="createFile" aria-label="createFile">
                        <InsertDriveFileIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="upload" aria-label="upload">
                        <CloudUploadIcon fontSize="small" />
                    </ToggleButton>
                </ButtonGroup>
                <Form />
            </Paper>
        </div>
    );
}
