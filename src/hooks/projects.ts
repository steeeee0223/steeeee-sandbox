import { useEffect } from "react";
import { shallowEqual } from "react-redux";

import { setLoading } from "@/stores/directory";
import { projectSelector } from "@/stores/project";

import { useAuth } from "./auth";
import { useAppDispatch, useAppSelector } from "./stores";

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
