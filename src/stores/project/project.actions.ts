import { PayloadAction } from "@reduxjs/toolkit";

import { ProjectActionTypes } from "@/stores/project/project.types";
import { AppDispatch } from "@/hooks";

const __setLoading = (
    payload: boolean
): PayloadAction<typeof payload, ProjectActionTypes> => ({
    type: ProjectActionTypes.SET_LOADING,
    payload,
});

const __setProject = (
    payload: string | null
): PayloadAction<typeof payload, ProjectActionTypes> => ({
    type: ProjectActionTypes.SET_PROJECT,
    payload,
});

/**
 * Action Creators
 */
export const setProject =
    (projectId: string | null) => (dispatch: AppDispatch) => {
        dispatch(__setProject(projectId));
    };
