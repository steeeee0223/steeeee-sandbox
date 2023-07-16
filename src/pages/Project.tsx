import { Divider, Grid, Typography } from "@mui/material";

import { Frame, Loading, NotFound, TabInfo, Tabs } from "@/components/common";
import { Editors } from "@/components/project";
import { sampleCode } from "@/data";
import { usePath, useProjects } from "@/hooks";

export default function Project() {
    const {
        path: [, , projectId],
    } = usePath();
    const { projectIsLoading, isProjectOfUser } = useProjects();

    const frames: TabInfo[] = [
        { id: "0", label: "Browser", component: <Frame code={sampleCode} /> },
        {
            id: "1",
            label: "Terminal",
            component: <Typography>Terminal</Typography>,
        },
    ];

    return projectIsLoading ? (
        <Loading />
    ) : isProjectOfUser(projectId) ? (
        <Grid container spacing={0}>
            <Grid item xs={6} sx={{ height: "100%" }}>
                <Editors />
            </Grid>
            <Divider flexItem orientation="vertical" />
            <Grid item xs={6} sx={{ height: "100vh" }}>
                <Tabs children={frames} defaultValue="1" />
            </Grid>
        </Grid>
    ) : (
        <NotFound message="Project Not Found" />
    );
}
