import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { authReducer } from "./auth";
import { cursorReducer } from "./cursor";
import { directoryReducer } from "./directory";
import { editorReducer } from "./editor";
import { projectReducer } from "./project";

const rootPersistConfig = {
    key: "root",
    storage,
    /**
     * @param whitelist
     * @description The key names of reducers to be persisted
     */
    whitelist: ["auth"],
};

export const reducers = {
    auth: authReducer,
    cursor: cursorReducer,
    directory: directoryReducer,
    editor: editorReducer,
    project: projectReducer,
};
export const rootReducer = combineReducers(reducers);

const store = configureStore({
    reducer: persistReducer(rootPersistConfig, rootReducer),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;
