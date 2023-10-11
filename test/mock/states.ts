import { reducers } from "@/stores/store";
import { initialState as authState } from "@/stores/auth";
import { initialState as cursorState } from "@/stores/cursor";
import {
    directoryAdapter,
    initialState as directoryState,
} from "@/stores/directory";
import { editorAdapter, initialState as editorState } from "@/stores/editor";
import { initialState as projectState } from "@/stores/project";
import { sampleFiles, sampleUser } from "@/data";
import { $files, $folders, $projectId, $projects } from "./db";

export const $preloadedState = {
    auth: authState,
    cursor: cursorState,
    directory: directoryState,
    editor: editorState,
    project: projectState,
};

export const $loggedInState = {
    ...$preloadedState,
    auth: { user: sampleUser, isLoggedIn: true },
};
const $projectState: typeof projectState = {
    isLoading: false,
    currentProject: { id: $projectId, action: "edit" },
    ids: [$projectId],
    entities: {
        [$projectId]: {
            ...$projects.one.state,
            projectId: $projectId,
        },
    },
};
export const $projectSelectedState = {
    ...$loggedInState,
    project: $projectState,
};

const addDirectoryItems = () =>
    directoryAdapter.addMany(directoryState, [
        ...$folders.state,
        ...$files.state,
    ]);

export const $projectEditState = {
    ...$projectSelectedState,
    directory: addDirectoryItems(),
};
const addEditors = () =>
    editorAdapter.addMany(
        editorState,
        $files.state.map(({ itemId, name, extension, content }) => ({
            id: itemId,
            content,
            name,
            extension,
        }))
    );
export const $noEditorsSelectedState = {
    ...$projectEditState,
    editor: addEditors(),
};
export const $editorSelectedState = {
    ...$projectEditState,
    editor: {
        ...addEditors(),
        currentEditor: sampleFiles[1].itemId,
        currentText: sampleFiles[1].content,
    },
};

export const $reducers = reducers;
