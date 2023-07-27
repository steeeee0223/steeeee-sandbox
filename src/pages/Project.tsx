import { Divider, Grid } from "@mui/material";
import { SandpackProvider } from "@codesandbox/sandpack-react";

import { Loading, NotFound } from "@/components/common";
import { Editors, Viewer } from "@/components/project";
import { sampleSetup, sampleTemplate } from "@/data";
import { usePath, useProjects, useDirectory } from "@/hooks";

export default function Project() {
    const {
        path: [, , projectId],
    } = usePath();
    const { projectIsLoading, isProjectOfUser } = useProjects();
    const { bundledFiles } = useDirectory();

    return projectIsLoading ? (
        <Loading />
    ) : isProjectOfUser(projectId) ? (
        <SandpackProvider
            template={sampleTemplate}
            customSetup={sampleSetup}
            files={bundledFiles}
        >
            <Grid container spacing={0}>
                <Grid item xs={6} sx={{ height: "100%" }}>
                    <Editors />
                </Grid>
                <Divider flexItem orientation="vertical" />
                <Grid item xs={6} sx={{ height: "100vh" }}>
                    <Viewer />
                </Grid>
            </Grid>
        </SandpackProvider>
    ) : (
        <NotFound message="Project Not Found" />
    );
}
