import * as React from "react";
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
} from "@mui/material";
import {
    ContentCopy,
    ContentCut,
    ContentPaste,
    DriveFileRenameOutline,
} from "@mui/icons-material";
import { shallowEqual } from "react-redux";

import { useAppDispatch, useAppSelector, useDirectory } from "@/hooks";
import { copyItems, deleteDirectoryAsync } from "@/stores/directory";
import { setRenameItem } from "@/stores/cursor";

interface ContextMenuProps {
    itemId: string;
    children: React.ReactNode;
}

export default function ContextMenu({ itemId, children }: ContextMenuProps) {
    const { copiedItems } = useAppSelector(
        (state) => ({
            copiedItems: state.directory.copiedItems,
        }),
        shallowEqual
    );
    const dispatch = useAppDispatch();

    const { projectId, item, children: childrenItems } = useDirectory(itemId);

    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        // const item = directorySelector.selectById(directoryState, itemId);
        console.log(`Clicking item: ${item?.name}`);
        dispatch(setRenameItem(null));
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

    const handleDelete = () => {
        handleClose();
        if (projectId) dispatch(deleteDirectoryAsync({ projectId, itemId }));
    };

    const handleRename = () => {
        handleClose();
        dispatch(setRenameItem(itemId));
        console.log(`Rename item: ${itemId}`);
    };

    const handleCopy = () => {
        handleClose();
        console.log(`Copy item: ${itemId}`);
        dispatch(copyItems({ rootId: itemId, items: childrenItems }));
    };

    const handlePaste = () => {
        handleClose();
        console.log(`Pasting items to: ${itemId}`);
        console.log(copiedItems);
    };

    return (
        <>
            <div
                onContextMenu={handleContextMenu}
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
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        ⌫
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleRename}>
                    <ListItemIcon>
                        <DriveFileRenameOutline fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Rename</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleCopy}>
                    <ListItemIcon>
                        <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        ⌘C
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handlePaste}>
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
