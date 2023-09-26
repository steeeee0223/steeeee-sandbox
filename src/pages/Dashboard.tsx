import { Loading } from "@/components/common";
import { Table } from "@/components/dashboard";
import { useProjects } from "@/hooks";

export default function Dashboard() {
    const { projectIsLoading } = useProjects();

    return (
        <>
            <h1>Dashboard</h1>
            {projectIsLoading ? <Loading /> : <Table />}
        </>
    );
}
