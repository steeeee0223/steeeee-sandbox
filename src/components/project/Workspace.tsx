import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { Container } from "@mui/material";

import {
    useAppDispatch,
    useAppSelector,
    AppDispatch,
    RootState,
} from "@/hooks";
import { getItems } from "@/stores/files";
import { Loading } from "@/components/common";
import Editors from "./Editors";

export default function Workspace() {
    const { isLoading, currentItem } = useAppSelector(
        (state: RootState) => ({
            // user: state.auth.user,
            // isLoggedIn: state.auth.isAuthenticated,
            isLoading: state.files.isLoading,
            currentItem: state.files.currentItem,
        }),
        shallowEqual
    );
    const userId = "admin"; // temp
    const dispatch: AppDispatch = useAppDispatch();

    const getFullPath = () => {
        const { item, path } = currentItem;
        const full = path.name.concat([item.name]);
        return full.join(" / ");
    };
    const getFullId = () => {
        const { item, path } = currentItem;
        const full = path.id.concat([item.id]);
        return full.join(" / ");
    };

    useEffect(() => {
        if (isLoading) {
            dispatch(getItems(userId));
        }
    }, [isLoading, dispatch, userId]);

    return (
        <Container>
            <p>Full Id: {getFullId()}</p>
            <p>
                Full Path: {getFullPath()} -{" "}
                {currentItem.item.isFolder ? "folder" : "file"}
            </p>
            {isLoading && <Loading />}
            <Editors />
        </Container>
    );
}
