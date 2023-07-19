import { FormEventHandler, useState } from "react";
import { shallowEqual } from "react-redux";
import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { useAppDispatch, useAppSelector, useDirectory } from "@/hooks";
import { setCreation } from "@/stores/cursor";
import { createFileAsync } from "@/stores/directory";
import { getExtension } from "@/lib/file";

export default function CreateFile() {
    const [name, setName] = useState("");

    const { projectId, currentItem } = useAppSelector(
        (state) => ({
            // user: state.auth.user,
            projectId: state.project.currentProject?.id,
            currentItem: state.directory.currentItem,
        }),
        shallowEqual
    );
    const { item, path } = currentItem;
    const { isFilePresent } = useDirectory();
    const dispatch = useAppDispatch();

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (projectId) {
            if (name) {
                if (!isFilePresent(item.id, name)) {
                    dispatch(setCreation(null));

                    const data = {
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name,
                        path: item.id === "root" ? [] : [...path.id, item.id],
                        parent: item.id,
                        lastAccessed: null,
                        content: "",
                        extension: getExtension(name),
                        // userId: user.uid,
                        // createdBy: user.name
                    };
                    dispatch(createFileAsync({ projectId, data }));
                } else {
                    setName("");
                    alert(`File ${name} already present!`);
                }
            } else {
                alert(`File name is required!`);
            }
        } else {
            alert(`NO PROJECT SELECTED!`);
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
                placeholder="Enter a file name..."
                inputProps={{ "aria-label": "file-name" }}
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                autoFocus
            />
            <Divider sx={{ height: 20, m: 0.5 }} orientation="vertical" />
            <IconButton type="submit" sx={{ p: "10px 5px" }} aria-label="file">
                <AddBoxIcon fontSize="small" />
            </IconButton>
        </Paper>
    );
}
