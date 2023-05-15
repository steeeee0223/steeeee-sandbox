import { Dispatch, SetStateAction, useState } from "react";

import { createCtx } from "@/hooks";

interface AppContextInterface {
    sidebar: string;
    setSidebar: Dispatch<SetStateAction<string>>;
}

export const [useAppContext, AppContextProvider] =
    createCtx<AppContextInterface>();

export function AppProvider({ children }: { children: JSX.Element }) {
    /**
     * sidebar: "default", "projectId"
     */
    const [sidebar, setSidebar] = useState("default");
    return (
        <AppContextProvider
            value={{
                sidebar,
                setSidebar,
            }}
        >
            {children}
        </AppContextProvider>
    );
}
