import { MouseEvent } from "react";
import { shallowEqual } from "react-redux";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
    useAppDispatch,
    useAppSelector,
    AppDispatch,
    RootState,
} from "@/hooks";
import { CodeEditor, TabInfo, Tabs } from "@/components/common";
import { closeEditor, setEditor } from "@/stores/files";
import { ProjectStorage } from "@/lib/projectStorage";
import Breadcrumbs from "./Breadcrumbs";
import { File } from "./FolderSystem";

export default function Editors() {
    const { fileState } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            // isLoggedIn: state.auth.isAuthenticated,
            fileState: state.files,
        }),
        shallowEqual
    );
    const dispatch: AppDispatch = useAppDispatch();
    const project = new ProjectStorage(fileState);
    const children: TabInfo[] = fileState.editors.map((itemId) => {
        const file = project.getFile(itemId) ?? (undefined as never);
        const [path, _] = project.getFullPath(itemId);
        const { title, extension, content } = file as File;
        return {
            id: itemId,
            label: title,
            icon: (
                <IconButton
                    component="span"
                    sx={{
                        padding: 0,
                        fontSize: "small",
                    }}
                    onClick={(e) => handleCloseEditor(e, itemId)}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            ),
            component: (
                <>
                    <Breadcrumbs path={path} />
                    <CodeEditor
                        name={title}
                        language={extension}
                        value={content}
                        readOnly={false}
                    />
                </>
            ),
        };
    });

    const handleCloseEditor = (e: MouseEvent, itemId: string) => {
        e.stopPropagation();
        dispatch(closeEditor(itemId));
        const newId = fileState.editors.find((id) => id !== itemId) ?? null;
        dispatch(setEditor(newId));
    };

    return (
        <>
            {fileState.currentEditor && (
                <Tabs
                    children={children}
                    defaultValue={fileState.currentEditor}
                    onChange={(val) => dispatch(setEditor(val))}
                />
            )}
        </>
    );
}
