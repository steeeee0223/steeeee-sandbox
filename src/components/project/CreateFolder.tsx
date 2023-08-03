import { FormEventHandler, useState } from "react";
import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { useAppDispatch, useDirectory } from "@/hooks";
import { setCreation } from "@/stores/cursor";
import { createFolderAsync } from "@/stores/directory";

export default function CreateFolder() {
    const [folderName, setFolderName] = useState("");

    const dispatch = useAppDispatch();
    const { isFolderPresent, currentItem, project } = useDirectory();
    const { item, path } = currentItem;

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (folderName) {
            if (!isFolderPresent(item.id, folderName)) {
                dispatch(setCreation(null));
                const data = {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: folderName,
                    path: [...path.name, item.name],
                    parent: item.id,
                    lastAccessed: null,
                };
                dispatch(createFolderAsync({ project, data }));
            } else {
                alert(`Folder ${folderName} already present!`);
                setFolderName("");
            }
        } else {
            alert(`Folder name is required!`);
        }
    };

    return (
        <Paper
            elevation={0}
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: "0px 6px 0px 10px",
                display: "flex",
                alignItems: "center",
                height: 30,
                width: 400,
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1, fontSize: "small" }}
                size="small"
                placeholder="Enter a folder name..."
                inputProps={{ "aria-label": "folder-name" }}
                value={folderName}
                onChange={(e) => setFolderName(e.currentTarget.value)}
                autoFocus
            />
            <Divider sx={{ height: 20, m: 0.5 }} orientation="vertical" />
            <IconButton
                type="submit"
                sx={{ p: "10px 5px" }}
                aria-label="folder"
            >
                <AddBoxIcon fontSize="small" />
            </IconButton>
        </Paper>
    );
}
