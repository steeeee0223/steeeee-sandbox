import { useEffect } from "react";
import { shallowEqual } from "react-redux";

import { Loading } from "@/components/common";
import { Table } from "@/components/dashboard";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getProjectsAsync, setProject } from "@/stores/project";

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector(
        (state) => ({
            isLoading: state.project.isLoading,
        }),
        shallowEqual
    );
    const userId = "admin";

    useEffect(() => {
        dispatch(setProject(null));
        if (isLoading) {
            dispatch(getProjectsAsync(userId));
        }
    }, [isLoading, userId]);

    return (
        <div>
            <h1>Dashboard</h1>
            {isLoading ? <Loading /> : <Table />}
        </div>
    );
}
