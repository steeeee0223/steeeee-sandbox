import * as React from "react";
import { shallowEqual } from "react-redux";
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

import {
    AppDispatch,
    RootState,
    useAppDispatch,
    useAppSelector,
} from "@/hooks";
import { selectItem } from "@/stores/files";
import { FolderSystemItem, SelectedItem } from "../project/FolderSystem";
import CodeBlock from "./Codeblock";

export default function ControlledAccordion({ parent }: { parent: string }) {
    const [toggle, setToggle] = React.useState<Record<string, boolean>>({});

    const { userItems } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            userItems: (state.files.userFiles as FolderSystemItem[]).concat(
                state.files.userFolders
            ),
        }),
        shallowEqual
    );
    const dispatch: AppDispatch = useAppDispatch();

    const children: FolderSystemItem[] = userItems
        .filter((item) => item.parent === parent)
        .sort((item1, item2) => item1.title.localeCompare(item2.title));

    const getItemInfo = (currId: string) => {
        let { path, item }: SelectedItem = {
            item: { id: "", name: "", isFolder: {} as boolean },
            path: { id: [], name: [] },
        };
        let isFirst = true;

        const findParent = (currId: string): FolderSystemItem => {
            const item = userItems.find(({ itemId }) => itemId === currId);
            return item ?? (undefined as never);
        };

        while (currId !== "root") {
            const { isFolder, parent, title } = findParent(currId);
            if (isFirst) {
                item = { id: currId, name: title, isFolder };
                isFirst = false;
            } else {
                path.id.push(currId);
                path.name.push(title);
            }
            currId = parent;
        }
        path = {
            id: [...path.id, currId].reverse(),
            name: [...path.name, "root"].reverse(),
        };
        return { path, item };
    };

    const handleToggle = (pathIds: string[]) => {
        const map: Record<string, boolean> = {};
        pathIds.forEach((itemId) => (map[itemId] = true));
        setToggle(map);
    };

    const handleChange =
        (itemId: string) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            const selected = isExpanded ? itemId : parent;
            const current = getItemInfo(selected);
            dispatch(selectItem(current));
            handleToggle(current.path.id);
        };

    return (
        <div>
            {children.map((child) => {
                const { itemId, isFolder, title, subtitle, desc } = child;
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
                                    width: "33%",
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
                                {title}
                            </Typography>
                            {subtitle && (
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: "text.secondary",
                                        textAlign: "justify",
                                    }}
                                >
                                    {subtitle}
                                </Typography>
                            )}
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
                                    name={title}
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
