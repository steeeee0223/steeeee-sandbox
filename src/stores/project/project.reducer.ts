import { PayloadAction } from "@reduxjs/toolkit";

import {
    ProjectActionTypes,
    ProjectState,
} from "@/stores/project/project.types";

const initialState: ProjectState = {
    isLoading: true,
    currentProject: null,
    userProjects: ["1"],
};

const projectReducer = (
    state: ProjectState = initialState,
    { type, payload }: PayloadAction<any, ProjectActionTypes>
): ProjectState => {
    switch (type) {
        case ProjectActionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: payload,
            };
        case ProjectActionTypes.SET_PROJECT:
            return { ...state, currentProject: payload };

        default:
            return state;
    }
};
export default projectReducer;
