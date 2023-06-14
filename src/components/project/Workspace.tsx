import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { Container } from "@mui/material";

import {
    useAppDispatch,
    useAppSelector,
    AppDispatch,
    RootState,
} from "@/hooks";
import { getDirectoryAsync } from "@/stores/directory";
import { Loading } from "@/components/common";
import Editors from "./Editors";

export default function Workspace() {
    const { isLoading, projectId } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            // isLoggedIn: state.auth.isAuthenticated,
            isLoading: state.directory.isLoading,
            projectId: state.project.currentProject?.id,
        }),
        shallowEqual
    );
    const userId = "admin"; // temp
    const dispatch: AppDispatch = useAppDispatch();

    useEffect(() => {
        if (isLoading && projectId)
            dispatch(getDirectoryAsync({ userId, projectId }));
    }, [isLoading, dispatch, userId, projectId]);

    return (
        <Container>
            {isLoading && <Loading />}
            <Editors />
        </Container>
    );
}
