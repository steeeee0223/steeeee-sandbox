import { PayloadAction } from "@reduxjs/toolkit";

import { AuthActionTypes, AuthState } from "@/stores/auth/auth.types";

const initialState = {
    isLoggedIn: false,
    user: "",
    userId: "",
};

const authReducer = (
    state: AuthState = initialState,
    { type, payload }: PayloadAction<any, AuthActionTypes>
) => {
    switch (type) {
        case AuthActionTypes.SET_USER:
            state = {
                isLoggedIn: true,
                user: payload.user,
                userId: payload.userId,
            };
            return state;
        case AuthActionTypes.RESET_USER:
            state = initialState;
            return state;
        default:
            return state;
    }
};
export default authReducer;
