import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { shallowEqual } from "react-redux";
import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { useAppDispatch, useAppSelector, useDirectory } from "@/hooks";
import { setCreation } from "@/stores/cursor";
import { UploadFile, uploadFileAsync } from "@/stores/directory";
import { getContent, getExtension } from "@/lib/file";

export default function UploadForm() {
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

    const { projectId, currentItem } = useAppSelector(
        (state) => ({
            // user: state.auth.user,
            projectId: state.project.currentProject?.id,
            currentItem: state.directory.currentItem,
        }),
        shallowEqual
    );
    const { item, path } = currentItem;
    const { isFilePresent } = useDirectory(item.id);
    const dispatch = useAppDispatch();

    const setFilename = (filename: string): string => {
        if (!isFilePresent(filename)) return filename;
        const split = filename.split(".");
        if (split.length === 0) {
            return `${filename}-2`;
        }
        const ext = split.pop() ?? (undefined as never);
        return `${split.join(".")}-2.${ext}`;
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const files = e.currentTarget.files;
        if (files !== null) {
            console.log(`selected ${files.length} files`);
            setUploadFiles(Object.values(files));
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (projectId) {
            if (uploadFiles) {
                dispatch(setCreation(null));

                uploadFiles.forEach(async (file) => {
                    const content = await getContent(file);
                    const filename = setFilename(file.name);
                    const data = {
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        name: filename,
                        path: item.id === "root" ? [] : [...path.id, item.id],
                        parent: item.id,
                        lastAccessed: null,
                        content,
                        extension: getExtension(file.name),
                        // userId: user.uid,
                        // createdBy: user.name
                    };
                    dispatch(uploadFileAsync({ projectId, file, data }));
                });
            } else {
                alert(`File name is required!`);
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
                p: "6px",
                display: "flex",
                alignItems: "center",
                height: 30,
                width: 400,
            }}
        >
            <InputBase
                type="file"
                componentsProps={{
                    input: { multiple: true },
                }}
                sx={{ ml: 1, flex: 1, fontSize: "small" }}
                size="small"
                inputProps={{ "aria-label": "files" }}
                onChange={handleChange}
            />
            <Divider sx={{ height: 20, m: 0.5 }} orientation="vertical" />
            <IconButton
                type="submit"
                color="primary"
                sx={{ m: "2px", p: "5px", borderRadius: "2px", height: 30 }}
                aria-label="files"
                size="small"
            >
                <AddBoxIcon fontSize="inherit" />
            </IconButton>
        </Paper>
    );
}
