import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { Container } from "@mui/material";

import ControlledAccordion from "./Accordion";
import {
    useAppDispatch,
    useAppSelector,
    AppDispatch,
    RootState,
} from "@/hooks";
import { getItems } from "@/stores/files";
import { Loading } from "@/components/common";
import Breadcrumbs from "./Breadcrumbs";

const Workspace = () => {
    const { isLoading } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            // isLoggedIn: state.auth.isAuthenticated,
            isLoading: state.files.isLoading,
        }),
        shallowEqual
    );
    const userId = "admin"; // temp
    const dispatch: AppDispatch = useAppDispatch();

    useEffect(() => {
        if (isLoading) {
            dispatch(getItems(userId));
        }
    }, [isLoading, dispatch, userId]);

    return (
        <Container>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Breadcrumbs />
                    <ControlledAccordion parent="root" />
                </>
            )}
        </Container>
    );
};

export default Workspace;
