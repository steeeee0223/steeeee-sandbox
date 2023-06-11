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
    const { isLoading } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            // isLoggedIn: state.auth.isAuthenticated,
            isLoading: state.directory.isLoading,
        }),
        shallowEqual
    );
    const userId = "admin"; // temp
    const dispatch: AppDispatch = useAppDispatch();

    useEffect(() => {
        if (isLoading) dispatch(getDirectoryAsync(userId));
    }, [isLoading, dispatch, userId]);

    return (
        <Container>
            {isLoading && <Loading />}
            <Editors />
        </Container>
    );
}
