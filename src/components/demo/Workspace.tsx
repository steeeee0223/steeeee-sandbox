import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { Container } from "@mui/material";

import ControlledAccordion from "./Accordion";
import { useAppDispatch, useAppSelector, useAuth } from "@/hooks";
import { getDirectoryAsync } from "@/stores/directory";
import { Loading } from "@/components/common";
import Breadcrumbs from "./Breadcrumbs";

const Workspace = () => {
    const { user } = useAuth();
    const { isLoading, projectId } = useAppSelector(
        (state) => ({
            isLoading: state.directory.isLoading,
            projectId: state.project.currentProject?.id,
        }),
        shallowEqual
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isLoading && user && projectId) {
            dispatch(getDirectoryAsync({ userId: user.uid, projectId }));
        }
    }, [isLoading, dispatch, user, projectId]);

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
