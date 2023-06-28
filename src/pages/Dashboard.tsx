import { useEffect } from "react";
import { shallowEqual } from "react-redux";

import { Loading } from "@/components/common";
import { Table } from "@/components/dashboard";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getProjectsAsync, setProject } from "@/stores/project";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const { isLoading, user } = useAppSelector(
        (state) => ({
            isLoading: state.project.isLoading,
            user: state.auth.user,
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(setProject(null));
        if (isLoading && user) {
            dispatch(getProjectsAsync(user.uid));
        }
    }, [isLoading, user]);

    return (
        <div>
            <h1>Dashboard</h1>
            {isLoading ? <Loading /> : <Table />}
        </div>
    );
}
