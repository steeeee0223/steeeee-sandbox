import { reducers } from "@/stores/store";
import { initialState as authState } from "@/stores/auth";
import { initialState as cursorState } from "@/stores/cursor";
import { initialState as directoryState } from "@/stores/directory";
import { initialState as editorState } from "@/stores/editor";
import { initialState as projectState } from "@/stores/project";
import { sampleUser } from "@/data";
import { mockedProjectId, mockedProjects } from "./mock";

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
    currentProject: { id: mockedProjectId, action: "edit" },
    ids: [mockedProjectId],
    entities: {
        [mockedProjectId]: {
            ...mockedProjects.one.state,
            projectId: mockedProjectId,
        },
    },
};
export const $projectSelectedState = {
    ...$loggedInState,
    project: $projectState,
};

export const $reducers = reducers;
