import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Divider, Grid, Typography } from "@mui/material";

import { Frame, TabInfo, Tabs } from "@/components/common";
import { Workspace } from "@/components/project";
import { sampleCode } from "@/data";
import { AppDispatch, useAppDispatch } from "@/hooks";
import { setProject } from "@/stores/project";

export default function Project() {
    const { pathname } = useLocation();
    const [, , projectId] = pathname.split("/");
    const dispatch: AppDispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setProject(projectId ?? null));
    }, [projectId]);

    const frames: TabInfo[] = [
        { id: "0", label: "Browser", component: <Frame code={sampleCode} /> },
        {
            id: "1",
            label: "Terminal",
            component: <Typography>Terminal</Typography>,
        },
    ];

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={6} sx={{ bgcolor: "inherit", height: "100%" }}>
                    <Workspace />
                </Grid>
                <Divider flexItem orientation="vertical" />
                <Grid item xs={6} sx={{ bgcolor: "inherit", height: "100%" }}>
                    <Tabs children={frames} defaultValue="1" />
                </Grid>
            </Grid>
        </div>
    );
}
