import * as React from "react";
import { shallowEqual } from "react-redux";
import { Typography, IconButton } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import {
    AppDispatch,
    RootState,
    useAppDispatch,
    useAppSelector,
    useDirectory,
} from "@/hooks";
import {
    selectItem,
    getChildren,
    getSelectedItem,
    toList,
} from "@/stores/directory";
import { openEditor } from "@/stores/editor";
import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion";
import ContextMenu from "./ContextMenu";

export default function FolderSystem({ parent }: { parent: string }) {
    const [toggle, setToggle] = React.useState<Record<string, boolean>>({});

    const { currentItem } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            currentItem: state.directory.currentItem,
        }),
        shallowEqual
    );
    const { firstLayerChildren, directory } = useDirectory(parent);
    const dispatch: AppDispatch = useAppDispatch();
    // const children = getChildren(directory, parent);
    const children = firstLayerChildren;
    const handleToggle = (pathIds: string[]) => {
        const map: Record<string, boolean> = {};
        pathIds.forEach((itemId) => (map[itemId] = true));
        setToggle(map);
    };

    const handleChange =
        (itemId: string, isFolder: boolean) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            const selectedId = isExpanded ? itemId : parent;
            const item = getSelectedItem(directory, selectedId);
            dispatch(selectItem(item));
            handleToggle(item.path.id);
            if (!isFolder) dispatch(openEditor(itemId));
        };

    return (
        <div>
            {children.map((child) => {
                const { itemId, isFolder, title } = child;
                return (
                    <Accordion
                        key={itemId}
                        expanded={toggle[itemId]}
                        onChange={handleChange(itemId, isFolder)}
                        {...(currentItem.item.id === itemId && {
                            sx: { backgroundColor: "#e0e0e0" },
                        })}
                    >
                        <ContextMenu itemId={itemId}>
                            <AccordionSummary
                                aria-controls={`content-${itemId}`}
                                id={`header-${itemId}`}
                            >
                                <Typography
                                    sx={{
                                        width: "33%",
                                        flexShrink: 0,
                                        fontSize: 12,
                                    }}
                                >
                                    <IconButton size="small" sx={{ mr: 1 }}>
                                        {isFolder ? (
                                            <FolderIcon fontSize="small" />
                                        ) : (
                                            <InsertDriveFileIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                    {title}
                                </Typography>
                            </AccordionSummary>
                        </ContextMenu>
                        <AccordionDetails sx={{ margin: 0 }}>
                            {isFolder && <FolderSystem parent={itemId} />}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    );
}
