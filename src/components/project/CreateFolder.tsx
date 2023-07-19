import { FormEventHandler, useState } from "react";
import { shallowEqual } from "react-redux";
import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { useAppDispatch, useAppSelector, useDirectory } from "@/hooks";
import { setCreation } from "@/stores/cursor";
import { createFolderAsync } from "@/stores/directory";

export default function CreateFolder() {
    const [folderName, setFolderName] = useState("");

    const { currentItem, projectId } = useAppSelector(
        (state) => ({
            // user: state.auth.user,
            currentItem: state.directory.currentItem,
            projectId: state.project.currentProject?.id,
        }),
        shallowEqual
    );
    const { item, path } = currentItem;
    const { isFolderPresent } = useDirectory();
    const dispatch = useAppDispatch();

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (projectId) {
            if (folderName) {
                if (!isFolderPresent(item.id, folderName)) {
                    dispatch(setCreation(null));
                    const data = {
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: folderName,
                        path: item.id === "root" ? [] : [...path.id, item.id],
                        parent: item.id,
                        lastAccessed: null,
                        // userId: user.uid,
                        // createdBy: user.name
                    };
                    dispatch(createFolderAsync({ projectId, data }));
                } else {
                    alert(`Folder ${folderName} already present!`);
                    setFolderName("");
                }
            } else {
                alert(`Folder name is required!`);
            }
        } else {
            alert(`NO PROJECT SELECTED`);
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
