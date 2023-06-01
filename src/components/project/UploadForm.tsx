import { ChangeEventHandler, FormEventHandler, useState } from "react";
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
    UploadFile,
    getAllFiles,
    uploadFileAsync,
} from "@/stores/directory";

export default function UploadForm() {
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

    const { projectId, currentItem, directoryState } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            projectId: state.project.currentProject,
            currentItem: state.directory.currentItem,
            directoryState: state.directory,
        }),
        shallowEqual
    );
    const { item: currItem, path: currPath } = currentItem;
    const dispatch: AppDispatch = useAppDispatch();

    const userFiles = getAllFiles(directoryState);
    const setFilename = (filename: string): string => {
        const filePresent = userFiles
            .filter(({ parent }) => parent === currItem.id)
            .find(
                ({ title, parent }: DirectoryItem) =>
                    title === filename && parent === currItem.id
            );
        if (!filePresent) return filename;
        const split = filename.split(".");
        if (split.length === 0) {
            return `${filename}-2`;
        }
        const ext = split.pop() ?? (undefined as never);
        return `${split.join(".")}-2.${ext}`;
    };

    const getExt = (name: string): string => {
        if (name.startsWith(".")) return "";
        const split = name.split(".");
        if (split.length === 0) {
            return "";
        }
        return split.at(split.length - 1) ?? "";
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const files = e.currentTarget.files;
        if (files !== null) {
            console.log(`selected ${files.length} files`);
            setUploadFiles(Object.values(files));
        }
    };

    const getContent = (file: UploadFile): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () =>
                resolve(reader.result !== null ? reader.result.toString() : "");
            reader.readAsText(file);
            reader.onerror = () => {
                console.log(`Error while reading file: ${reader.error}`);
            };
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (uploadFiles) {
            dispatch(setCreation(null));

            uploadFiles.forEach(async (file) => {
                const content = await getContent(file);
                const filename = setFilename(file.name);
                const data = {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    name: filename,
                    path:
                        currItem.id === "root"
                            ? []
                            : [...currPath.id, currItem.id],
                    parent: currItem.id,
                    lastAccessed: null,
                    content,
                    extension: getExt(file.name),
                    projectId,
                    // userId: user.uid,
                    // createdBy: user.name
                };
                dispatch(uploadFileAsync({ file, data }));
            });
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
