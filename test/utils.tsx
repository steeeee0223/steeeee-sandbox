import React, { PropsWithChildren } from "react";
import { render, renderHook, RenderOptions } from "@testing-library/react";
import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// As a basic setup, import your same slice reducers
import type { AppStore, RootState } from "@/hooks/stores";
import { persistor } from "@/stores/store";
import { $preloadedState, $reducers } from "./_redux";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
export interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
    preloadedState?: PreloadedState<RootState>;
    store?: AppStore;
}

export const $store: AppStore = configureStore({
    reducer: $reducers,
    preloadedState: $preloadedState,
});

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState = $preloadedState,
        // Automatically create a store instance if no store was passed in
        store = configureStore({
            reducer: $reducers,
            preloadedState,
        }),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {children}
                </PersistGate>
            </Provider>
        );
    }

    // Return an object with the store and all of RTL's query functions
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
export function renderHookWithProviders<HookProps, HookResults>(
    hook: (initialProps: HookProps) => HookResults,
    initialProps?: HookProps,
    {
        preloadedState = $preloadedState,
        // Automatically create a store instance if no store was passed in
        store = configureStore({
            reducer: $reducers,
            preloadedState,
        }),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {children}
                </PersistGate>
            </Provider>
        );
    }

    // Return an object with the store and all of RTL's query functions
    return {
        store,
        ...renderHook(hook, {
            initialProps,
            wrapper: Wrapper,
            ...renderOptions,
        }),
    };
}
