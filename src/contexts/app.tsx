import { Dispatch, SetStateAction, useState } from "react";

import { createCtx } from "@/hooks";

interface AppContextInterface {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export const [useAppContext, AppContextProvider] =
    createCtx<AppContextInterface>();

export function AppProvider({ children }: { children: JSX.Element }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <AppContextProvider
            value={{
                sidebarOpen,
                setSidebarOpen,
            }}
        >
            {children}
        </AppContextProvider>
    );
}
