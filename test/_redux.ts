import { reducers } from "@/stores/store";
import { initialState as authState } from "@/stores/auth";
import { initialState as cursorState } from "@/stores/cursor";
import { initialState as directoryState } from "@/stores/directory";
import { initialState as editorState } from "@/stores/editor";
import { initialState as projectState } from "@/stores/project";
import { sampleUser } from "@/data";

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

export const $reducers = reducers;
