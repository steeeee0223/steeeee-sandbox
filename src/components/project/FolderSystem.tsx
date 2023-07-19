import * as React from "react";
import { shallowEqual } from "react-redux";
import { Typography, IconButton, Stack } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { useAppDispatch, useAppSelector, useDirectory } from "@/hooks";
import { openEditor } from "@/stores/editor";

import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion";
import ContextMenu from "./ContextMenu";
import RenameForm from "./RenameForm";

export default function FolderSystem({ parent }: { parent: string }) {
    const [toggle, setToggle] = React.useState<Record<string, boolean>>({});

    const { renameItem } = useAppSelector(
        (state) => ({
            renameItem: state.cursor.renameItem,
        }),
        shallowEqual
    );
    const dispatch = useAppDispatch();
    const { getFirstLayerChildren, select, isCurrentItem } = useDirectory();
    const children = getFirstLayerChildren(parent);

    const handleToggle = (pathIds: string[]) => {
        const map: Record<string, boolean> = {};
        pathIds.forEach((itemId) => (map[itemId] = true));
        setToggle(map);
    };

    const handleChange =
        (itemId: string, isFolder: boolean) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            const selectedId = isExpanded ? itemId : parent;
            const item = select(selectedId);
            handleToggle(item.path.id);
            if (!isFolder) dispatch(openEditor(itemId));
        };

    return (
        <div>
            {children.map((child) => {
                const { itemId, isFolder, name } = child;
                return (
                    <Accordion
                        key={itemId}
                        expanded={toggle[itemId]}
                        onChange={handleChange(itemId, isFolder)}
                        {...(isCurrentItem(itemId) && {
                            sx: { bgcolor: "action.selected" },
                        })}
                    >
                        <ContextMenu itemId={itemId}>
                            <AccordionSummary
                                autoFocus
                                aria-controls={`content-${itemId}`}
                                id={`header-${itemId}`}
                            >
                                <Stack direction="row" alignItems="center">
                                    <IconButton size="small" sx={{ mr: 1 }}>
                                        {isFolder ? (
                                            <FolderIcon fontSize="small" />
                                        ) : (
                                            <InsertDriveFileIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                    {renameItem === itemId ? (
                                        <RenameForm
                                            itemId={itemId}
                                            placeholder={name}
                                        />
                                    ) : (
                                        <Typography
                                            sx={{
                                                width: "70%",
                                                flexShrink: 0,
                                                fontSize: 12,
                                            }}
                                        >
                                            {name}
                                        </Typography>
                                    )}
                                </Stack>
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
