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
import { File, getFile, getFullPath, toList } from "@/stores/directory";
import { closeEditors, setEditor } from "@/stores/editor";
import { CodeEditor, TabInfo, Tabs } from "@/components/common";
import Breadcrumbs from "./Breadcrumbs";

export default function Editors() {
    const { directory, editorIds, currentEditor } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            // isLoggedIn: state.auth.isAuthenticated,
            directory: toList(state.directory),
            editorIds: state.editor.ids,
            currentEditor: state.editor.currentEditor,
        }),
        shallowEqual
    );
    const dispatch: AppDispatch = useAppDispatch();
    const children: TabInfo[] = editorIds.map((id) => {
        const editorId = id as string;
        const file = getFile(directory, editorId) ?? (undefined as never);
        const [path, _] = getFullPath(directory, editorId);
        const { title, extension, content } = file as File;
        return {
            id: editorId,
            label: title,
            icon: (
                <IconButton
                    component="span"
                    sx={{
                        padding: 0,
                        fontSize: "small",
                    }}
                    onClick={(e) => handleCloseEditor(e, editorId)}
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

    const handleCloseEditor = (e: MouseEvent, editorId: string) => {
        e.stopPropagation();
        dispatch(closeEditors([editorId]));
    };

    return (
        <>
            {currentEditor && (
                <Tabs
                    children={children}
                    defaultValue={currentEditor}
                    onChange={(val) => dispatch(setEditor(val))}
                />
            )}
        </>
    );
}
