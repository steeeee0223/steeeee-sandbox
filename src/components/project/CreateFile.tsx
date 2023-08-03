import { FormEventHandler, useState } from "react";
import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { useAppDispatch, useDirectory } from "@/hooks";
import { setCreation } from "@/stores/cursor";
import { createFileAsync } from "@/stores/directory";
import { getExtension } from "@/lib/file";

export default function CreateFile() {
    const [name, setName] = useState("");

    const dispatch = useAppDispatch();
    const { isFilePresent, currentItem, project } = useDirectory();
    const { item, path } = currentItem;

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (name) {
            if (!isFilePresent(item.id, name)) {
                dispatch(setCreation(null));

                const data = {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name,
                    path: [...path.name, item.name],
                    parent: item.id,
                    lastAccessed: null,
                    content: "",
                    extension: getExtension(name),
                };
                dispatch(createFileAsync({ project, data }));
            } else {
                setName("");
                alert(`File ${name} already present!`);
            }
        } else {
            alert(`File name is required!`);
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
