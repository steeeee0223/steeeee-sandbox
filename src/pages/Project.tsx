import { useEffect } from "react";
import { Divider, Grid, Typography } from "@mui/material";

import { Frame, Loading, NotFound, TabInfo, Tabs } from "@/components/common";
import { Editors } from "@/components/project";
import { sampleCode } from "@/data";
import { useAppDispatch, usePath, useProjects } from "@/hooks";
import { setProject } from "@/stores/project";

export default function Project() {
    const {
        path: [, , projectId],
    } = usePath();
    const { projectIds, isLoading } = useProjects();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setProject({ id: projectId ?? null, action: "edit" }));
        console.log(`setting project to: ${projectId}`);
    }, [projectId]);

    const frames: TabInfo[] = [
        { id: "0", label: "Browser", component: <Frame code={sampleCode} /> },
        {
            id: "1",
            label: "Terminal",
            component: <Typography>Terminal</Typography>,
        },
    ];

    return isLoading ? (
        <Loading />
    ) : projectIds.includes(projectId) ? (
        <Grid container spacing={0}>
            <Grid item xs={6} sx={{ height: "100%" }}>
                <Editors />
            </Grid>
            <Divider flexItem orientation="vertical" />
            <Grid item xs={6} sx={{ height: "100%" }}>
                <Tabs children={frames} defaultValue="1" />
            </Grid>
        </Grid>
    ) : (
        <NotFound message="Project Not Found" />
    );
}
