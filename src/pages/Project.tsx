import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

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

    const [code, setCode] = useState<string>(sampleCode);
    const frames: TabInfo[] = [
        { id: "0", label: "Browser", component: <Frame code={code} /> },
        {
            id: "1",
            label: "Terminal",
            component: <Typography>Terminal</Typography>,
        },
    ];

    return (
        <div>
            <Box>
                <h1>
                    Project{" "}
                    <Button
                        href={`/demo/${projectId}`}
                        variant="contained"
                        endIcon={<ViewInArIcon />}
                    >
                        Demo
                    </Button>
                </h1>
            </Box>
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
