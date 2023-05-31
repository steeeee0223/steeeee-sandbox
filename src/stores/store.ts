import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import { cursorReducer } from "./cursor";
import { directoryReducer } from "./directory";
import { editorReducer } from "./editor";
import { projectReducer } from "./project";

export const rootReducer = combineReducers({
    cursor: cursorReducer,
    directory: directoryReducer,
    editor: editorReducer,
    project: projectReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
