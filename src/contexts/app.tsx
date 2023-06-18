import { Dispatch, SetStateAction, useState } from "react";

import { createCtx } from "@/hooks";

interface AppContextInterface {}

export const [useAppContext, AppContextProvider] =
    createCtx<AppContextInterface>();

export function AppProvider({ children }: { children: JSX.Element }) {
    return <AppContextProvider value={{}}>{children}</AppContextProvider>;
}
