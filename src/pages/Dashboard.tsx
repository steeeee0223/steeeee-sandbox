import { useEffect } from "react";

import { Table } from "@/components/dashboard";
import { useAppDispatch } from "@/hooks";
import { setProject } from "@/stores/project";

export default function Dashboard() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setProject(null));
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <Table />
        </div>
    );
}
