import { reducers } from "@/stores/store";
import { initialState as editorState } from "@/stores/editor";

export const $preloadedState = {
    editor: editorState,
};

export const $reducers = reducers;
