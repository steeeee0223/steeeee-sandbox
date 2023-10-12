import {
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    createContext,
    useContext,
    useState,
} from "react";

interface AppContextInterface {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextInterface | null>(null);

export const useAppContext = () => {
    const object = useContext(AppContext);
    if (!object) {
        throw new Error("useGetComplexObject must be used within a Provider");
    }
    return object;
};

export function AppProvider({ children }: PropsWithChildren) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <AppContext.Provider
            value={{
                sidebarOpen,
                setSidebarOpen,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
