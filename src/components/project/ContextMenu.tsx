import * as React from "react";
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
} from "@mui/material";
import { ContentCopy, ContentCut, ContentPaste } from "@mui/icons-material";
import { ProjectStorage } from "@/lib/projectStorage";
import {
    AppDispatch,
    RootState,
    useAppDispatch,
    useAppSelector,
} from "@/hooks";
import { shallowEqual } from "react-redux";
import { deleteFiles, deleteFolders } from "@/stores/files";

interface ContextMenuProps {
    itemId: string;
    children: React.ReactNode;
}

export default function ContextMenu({ itemId, children }: ContextMenuProps) {
    const { fileState } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            fileState: state.files,
        }),
        shallowEqual
    );
    const dispatch: AppDispatch = useAppDispatch();

    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent, itemId: string) => {
        event.preventDefault();
        const project = new ProjectStorage(fileState);
        const { title } = project.getItem(itemId);
        console.log(`Clicking item: ${title}`);
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX + 2,
                      mouseY: event.clientY - 6,
                  }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                  null
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const handleDelete = (itemId: string) => {
        setContextMenu(null);
        const project = new ProjectStorage(fileState);
        const { files, folders } = project.getRecursiveItemIds(itemId);
        console.log({ files, folders });
        dispatch(deleteFiles(files));
        dispatch(deleteFolders(folders));
    };

    return (
        <>
            <div
                onContextMenu={(e) => handleContextMenu(e, itemId)}
                style={{ cursor: "context-menu" }}
            >
                {children}
            </div>
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? {
                              top: contextMenu.mouseY,
                              left: contextMenu.mouseX,
                          }
                        : undefined
                }
            >
                <MenuItem onClick={() => handleDelete(itemId)}>
                    <ListItemIcon>
                        <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        ⌫
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        ⌘C
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <ContentPaste fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Paste</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        ⌘V
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    );
}
