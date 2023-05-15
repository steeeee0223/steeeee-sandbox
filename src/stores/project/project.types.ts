export interface ProjectState {
    isLoading: boolean;
    currentProject: string | null;
    userProjects: string[];
}

export enum ProjectActionTypes {
    SET_LOADING = "SET_LOADING",
    SET_PROJECT = "SET_PROJECT",
}
