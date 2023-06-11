import * as React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { AppDispatch, useAppDispatch, useDirectory } from "@/hooks";
import { selectItem, getSelectedItem } from "@/stores/directory";
import CodeBlock from "./Codeblock";

export default function ControlledAccordion({ parent }: { parent: string }) {
    const [toggle, setToggle] = React.useState<Record<string, boolean>>({});

    const dispatch: AppDispatch = useAppDispatch();
    const { directory, firstLayerChildren: children } = useDirectory(parent);

    const handleToggle = (pathIds: string[]) => {
        const map: Record<string, boolean> = {};
        pathIds.forEach((itemId) => (map[itemId] = true));
        setToggle(map);
    };

    const handleChange =
        (itemId: string) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            const selectedId = isExpanded ? itemId : parent;
            const item = getSelectedItem(directory, selectedId);
            dispatch(selectItem(item));
            handleToggle(item.path.id);
        };

    return (
        <div>
            {children.map((child) => {
                const { itemId, isFolder, name, desc } = child;
                return (
                    <Accordion
                        key={itemId}
                        expanded={toggle[itemId]}
                        onChange={handleChange(itemId)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`content-${itemId}`}
                            id={`header-${itemId}`}
                        >
                            <Typography
                                sx={{
                                    width: "70%",
                                    flexShrink: 0,
                                }}
                            >
                                <IconButton size="small" sx={{ mr: 1 }}>
                                    {isFolder ? (
                                        <FolderIcon />
                                    ) : (
                                        <InsertDriveFileIcon />
                                    )}
                                </IconButton>
                                {name}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ margin: 1 }}>
                            {desc && (
                                <Typography sx={{ marginBottom: 2 }}>
                                    {desc}
                                </Typography>
                            )}
                            {isFolder ? (
                                <ControlledAccordion parent={itemId} />
                            ) : (
                                <CodeBlock
                                    name={name}
                                    language={child.extension}
                                    value={child.content}
                                    readOnly
                                />
                            )}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    );
}
