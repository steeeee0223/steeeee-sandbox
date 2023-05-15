import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import { fileReducer } from "@/stores/files";
import { projectReducer } from "@/stores/project";

export const rootReducer = combineReducers({
    files: fileReducer,
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
