import { User } from "firebase/auth";

import { CreationType } from "./directory";

export interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
}

export interface CursorState {
    creationType: CreationType;
    fileActionType: string | null;
    dashboardAction: "create" | null;
}

export type Editor = {
    id: string;
    content: string;
    name: string;
    extension: string;
};
