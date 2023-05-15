import { Button, Divider } from "@mui/material";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import EditIcon from "@mui/icons-material/Edit";

import { Table } from "@/components/dashboard";

export default function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>

            <Button
                href={`/demo/1`}
                variant="contained"
                endIcon={<ViewInArIcon />}
            >
                Demo
            </Button>
            <Button
                href={`/project/1`}
                variant="contained"
                endIcon={<EditIcon />}
            >
                Edit
            </Button>
            <Divider sx={{ padding: 3 }} />
            <Table />
        </div>
    );
}
