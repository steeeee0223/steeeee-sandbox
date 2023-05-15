import { FormEventHandler, useState } from "react";
import { shallowEqual } from "react-redux";
import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { createFolder, setCreation } from "@/stores/files";
import {
    useAppDispatch,
    useAppSelector,
    AppDispatch,
    RootState,
} from "@/hooks";
import { FolderSystemItem } from "./FolderSystem";

export default function CreateFolder() {
    const [folderName, setFolderName] = useState("");

    const { userFolders, currentItem } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            userFolders: state.files.userFolders,
            currentItem: state.files.currentItem,
        }),
        shallowEqual
    );
    const { item, path } = currentItem;
    const dispatch: AppDispatch = useAppDispatch();

    const isFolderPresent = (name: string): boolean => {
        const folderPresent = userFolders
            .filter(({ parent }) => parent === item.id)
            .find(
                ({ title, parent }: FolderSystemItem) =>
                    title === name && parent === item.id
            );
        return !!folderPresent;
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (folderName) {
            if (!isFolderPresent(folderName)) {
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
                dispatch(createFolder(data));
            } else {
                setFolderName("");
                alert(`Folder ${folderName} already present!`);
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
            />
            <Divider sx={{ height: 20, m: 0.5 }} orientation="vertical" />
            <IconButton
                type="submit"
                color="primary"
                sx={{ p: "10px 5px" }}
                aria-label="folder"
            >
                <AddBoxIcon fontSize="small" />
            </IconButton>
        </Paper>
    );
}
