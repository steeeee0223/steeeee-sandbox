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
} from "@/hooks";
import { openEditor, selectItem, setEditor } from "@/stores/files";
import { ProjectStorage } from "@/lib/projectStorage";
import { Accordion, AccordionDetails, AccordionSummary } from "./Accordion";
import ContextMenu from "./ContextMenu";

type BaseItem = {
    parent: string;
    itemId: string;
    isFolder: boolean;
    title: string;
    subtitle?: string;
    desc?: string;
};

export type Folder = BaseItem & {
    isFolder: true;
    children?: FolderSystemItem[];
};

export type File = BaseItem & {
    isFolder: false;
    extension: string;
    content: string;
};

export type FolderSystemItem = Folder | File;

export type SelectedItem = {
    item: { id: string; name: string; isFolder: boolean };
    path: { id: string[]; name: string[] };
};

export default function FolderSystem({ parent }: { parent: string }) {
    const [toggle, setToggle] = React.useState<Record<string, boolean>>({});

    const { fileState } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            fileState: state.files,
        }),
        shallowEqual
    );
    const dispatch: AppDispatch = useAppDispatch();
    const project = new ProjectStorage(fileState);
    const children: FolderSystemItem[] = project.getChildren(parent);

    const handleToggle = (pathIds: string[]) => {
        const map: Record<string, boolean> = {};
        pathIds.forEach((itemId) => (map[itemId] = true));
        setToggle(map);
    };

    const handleChange =
        (itemId: string, isFolder: boolean) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            const selectedId = isExpanded ? itemId : parent;
            const item = project.getSelectedItem(selectedId);
            dispatch(selectItem(item));
            handleToggle(item.path.id);
            if (!isFolder) {
                dispatch(setEditor(itemId));

                if (!fileState.editors.includes(itemId)) {
                    dispatch(openEditor(itemId));
                }
            }
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
                    >
                        <ContextMenu>
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
