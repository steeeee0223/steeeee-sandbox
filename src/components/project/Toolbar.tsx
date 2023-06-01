import { MouseEvent } from "react";
import { shallowEqual } from "react-redux";
import {
    Divider,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    styled,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import {
    useAppDispatch,
    useAppSelector,
    AppDispatch,
    RootState,
} from "@/hooks";
import { setCreation, setFileAction } from "@/stores/cursor";
import { drawerWidth } from "@/theme";
import CreateFolder from "./CreateFolder";
import CreateFile from "./CreateFile";
import UploadForm from "./UploadForm";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    "& .MuiToggleButtonGroup-grouped": {
        "&.MuiToggleButton-root": {
            "&.MuiToggleButton-sizeSmall": {
                height: 30,
                width: 30,
            },
        },
        margin: theme.spacing(0.5),
        border: 0,
        "&.Mui-disabled": {
            border: 0,
        },
        "&:not(:first-of-type)": {
            borderRadius: theme.shape.borderRadius,
        },
        "&:first-of-type": {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));

export default function Toolbar() {
    const { fileActionType, creationType, currentItem } = useAppSelector(
        (state: RootState) => ({
            fileActionType: state.cursor.fileActionType,
            creationType: state.cursor.creationType,
            currentItem: state.directory.currentItem,
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
                <StyledToggleButtonGroup
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
                </StyledToggleButtonGroup>
                <Divider
                    flexItem
                    orientation="vertical"
                    sx={{ mx: 0.5, my: 1 }}
                />
                <StyledToggleButtonGroup
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
                </StyledToggleButtonGroup>
                <Form />
            </Paper>
        </div>
    );
}
