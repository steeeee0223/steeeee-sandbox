import { FormEventHandler, useState } from "react";
import { shallowEqual } from "react-redux";
import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import {
    useAppDispatch,
    useAppSelector,
    AppDispatch,
    RootState,
} from "@/hooks";
import { setCreation } from "@/stores/cursor";
import {
    DirectoryItem,
    createFolderAsync,
    getAllFolders,
} from "@/stores/directory";

export default function CreateFolder() {
    const [folderName, setFolderName] = useState("");

    const { directoryState, currentItem } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            directoryState: state.directory,
            currentItem: state.directory.currentItem,
        }),
        shallowEqual
    );
    const { item, path } = currentItem;
    const dispatch: AppDispatch = useAppDispatch();

    const userFolders = getAllFolders(directoryState);
    const isFolderPresent = (name: string): boolean => {
        const folderPresent = userFolders
            .filter(({ parent }) => parent === item.id)
            .find(
                ({ title, parent }: DirectoryItem) =>
                    title === name && parent === item.id
            );
        return !!folderPresent;
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (folderName) {
            if (!isFolderPresent(folderName)) {
                dispatch(setCreation(null));
                console.log(item);
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
                dispatch(createFolderAsync(data));
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
