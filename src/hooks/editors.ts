import { shallowEqual } from "react-redux";
import { SandpackFiles } from "@codesandbox/sandpack-react";

import { useDirectory } from "./directory";
import { useProjects } from "./projects";
import { useAppDispatch, useAppSelector } from "./stores";
import {
    Editor,
    closeEditors,
    editorSelector,
    openEditor,
    setEditor,
    updateText as _updateText,
    updateCurrentEditor,
} from "@/stores/editor";
import { File, updateFileAsync } from "@/stores/directory";

const nullEditor = {} as Editor;

type UpdateSandpackFile = (
    pathOrFiles: string | SandpackFiles,
    code?: string,
    shouldUpdatePreview?: boolean
) => void;
interface EditorsInfo {
    editors: Editor[];
    editorIds: string[];
    currentEditor: string | null;
    currentText: string;
    isModified: (editorId: string) => boolean;
}

interface EditorsOperations {
    getInfo: (editorId: string) => Editor;
    select: (editorId: string) => void;
    open: (editorId: string, autoSelect: boolean) => void;
    close: (editorIds: string[]) => void;
    updatePreview: (
        editorId: string,
        updateSandpackFile: UpdateSandpackFile
    ) => void;
    save: (editorId: string, updateSandpackFile?: UpdateSandpackFile) => void;
    updateText: (content: string) => void;
}

export function useEditors(): EditorsInfo & EditorsOperations {
    const dispatch = useAppDispatch();
    const { currentProject } = useProjects();
    const { getItem, getPath } = useDirectory();
    const { editorState, currentEditor, currentText } = useAppSelector(
        (state) => ({
            editorState: state.editor,
            currentEditor: state.editor.currentEditor,
            currentText: state.editor.currentText,
        }),
        shallowEqual
    );

    const editors = editorSelector.selectAll(editorState);
    const editorIds = editorSelector.selectIds(editorState) as string[];

    /**
     * @summary Compare the content of editor `editorId` in editor entities with that in directory entities
     */
    const isModified = (editorId: string) => {
        const { content } = getItem(editorId) as File;
        const { content: newContent } = getInfo(editorId);
        return content !== newContent;
    };
    /**
     * @summary Fetch the information of the editor `editorId`
     */
    const getInfo = (editorId: string) =>
        editorSelector.selectById(editorState, editorId) ?? nullEditor;
    /**
     * @summary Set `currentEditor` to `editorId`
     */
    const select = (editorId: string) => {
        console.log(`[Hook] set editor: ${editorId}`);
        dispatch(setEditor(editorId));
    };
    /**
     * @summary Add file `fileId` (from directory state) to editor entities, then select it
     */
    const open = (fileId: string, autoSelect: boolean) => {
        /** Add file `fileId` to editor entities */
        console.log(`[Hook] open editor: ${fileId}`);
        const file = getItem(fileId) as File;
        dispatch(openEditor(file));

        /** Auto select the editor `fileId`  */
        if (autoSelect) select(fileId);
    };
    /**
     * @summary Remove selected editors `editorIds`
     */
    const close = (editorIds: string[]) => {
        console.log(`[Hook] close editors: ${editorIds}`);
        dispatch(closeEditors(editorIds));
    };
    /**
     * @summary Update sandpack files
     */
    const updatePreview = (
        editorId: string,
        updateSandpackFile: UpdateSandpackFile
    ) => {
        const [path, _] = getPath(editorId);
        const pathName = path.join("/").slice(4);
        updateSandpackFile(pathName, currentText, true);
    };
    /**
     * @summary Save the latest content of editor `editorId` (from editor entities)
     * to directory via `directory/updateFileAsync`
     */
    const save = (editorId: string) => {
        console.log(`[Hook] save editor ${editorId}: ${isModified(editorId)}`);
        /** Update the content of `currentEditor` */
        dispatch(updateCurrentEditor());

        /** Save to Firebase & directory entities */
        dispatch(
            updateFileAsync({
                project: currentProject ?? (undefined as never),
                file: getItem(editorId) as File,
                content: currentText,
            })
        );
    };
    /**
     * @summary Update `currentText` to `content`
     */
    const updateText = (content: string) => {
        console.log(`[Hook] update current text`);
        dispatch(_updateText(content));
    };

    return {
        editors,
        editorIds,
        currentEditor,
        currentText,
        getInfo,
        select,
        open,
        close,
        isModified,
        save,
        updateText,
        updatePreview,
    };
}
