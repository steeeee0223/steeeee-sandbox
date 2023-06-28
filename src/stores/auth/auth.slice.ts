import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./auth";
import {
    GithubAuthProvider,
    GoogleAuthProvider,
    User,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { auth } from "@/config/firebase";

const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
};

export const googleSignIn = createAsyncThunk("auth/googleSignIn", async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    return user;
});

export const githubSignIn = createAsyncThunk("auth/githubSignIn", async () => {
    const provider = new GithubAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    return user;
});

export const signOutAsync = createAsyncThunk("auth/signOutAsync", async () => {
    await signOut(auth);
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(
            googleSignIn.fulfilled,
            (state, { payload }: PayloadAction<User>) => {
                state.isLoggedIn = true;
                state.user = payload;
            }
        );
        builder.addCase(
            githubSignIn.fulfilled,
            (state, { payload }: PayloadAction<User>) => {
                state.isLoggedIn = true;
                state.user = payload;
            }
        );
        builder.addCase(signOutAsync.fulfilled, (state) => {
            state.isLoggedIn = false;
            state.user = null;
        });
    },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
