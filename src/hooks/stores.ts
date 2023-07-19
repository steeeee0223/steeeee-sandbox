import { useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/config/firebase";
import store from "@/stores/store";
import {
    setUser,
    signOutAsync,
    googleSignIn as googleSignInAsync,
    githubSignIn as githubSignInAsync,
} from "@/stores/auth";
import { setLoading } from "@/stores/directory";
import { getProjectsAsync, projectSelector } from "@/stores/project";

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isLoggedIn } = useAppSelector(
        (state) => ({
            user: state.auth.user,
            isLoggedIn: state.auth.isLoggedIn,
        }),
        shallowEqual
    );
    const googleSignIn = () => dispatch(googleSignInAsync());
    const githubSignIn = () => dispatch(githubSignInAsync());
    const signOut = () => dispatch(signOutAsync());

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
            dispatch(setUser(currentUser))
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) dispatch(getProjectsAsync(user.uid));
    }, [user]);

    return { user, isLoggedIn, googleSignIn, githubSignIn, signOut };
};

export const useProjects = () => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const {
        projectState,
        currentProject,
        projectIsLoading,
        directoryIsLoading,
    } = useAppSelector(
        (state) => ({
            projectState: state.project,
            currentProject: state.project.currentProject,
            projectIsLoading: state.project.isLoading,
            directoryIsLoading: state.directory.isLoading,
        }),
        shallowEqual
    );
    const projects = projectSelector.selectAll(projectState);
    const projectIds = projectSelector.selectIds(projectState) as string[];
    const isProjectOfUser = (id: string | null | undefined): boolean =>
        !!id && projectIds.includes(id);
    const isProjectPresent = (projectName: string): boolean =>
        !!projects.find(({ name }) => projectName === name);
    const isProjectMatch = (projectName: string, id: string): boolean =>
        !!projects.find(
            ({ name, projectId }) => name === projectName && projectId === id
        );

    useEffect(() => {
        if (user && currentProject) {
            dispatch(setLoading());
        }
    }, [user, currentProject]);

    return {
        user,
        currentProject,
        projects,
        projectIds,
        projectIsLoading,
        directoryIsLoading,
        isProjectOfUser,
        isProjectPresent,
        isProjectMatch,
    };
};
