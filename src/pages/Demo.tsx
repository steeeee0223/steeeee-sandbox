import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { SandpackProvider } from "@codesandbox/sandpack-react";

import { Workspace } from "@/components/demo";
import { Preview } from "@/components/common";
import { sampleSetup, sampleTemplate } from "@/data";
import { useDirectory } from "@/hooks/directory";

export default function Demo() {
    const { bundledFiles } = useDirectory();

    return (
        <div>
            <Box>
                <h1>Demo Your App</h1>
            </Box>
            <Stack
                spacing={3}
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
            >
                <Container style={{ padding: 0 }}>
                    <Typography variant="body1" sx={{ marginBottom: 3 }}>
                        The accordion behaves like the root directory of your
                        project
                    </Typography>
                    <Workspace />
                </Container>
                <Container style={{ padding: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <SandpackProvider
                            template={sampleTemplate}
                            customSetup={sampleSetup}
                            files={bundledFiles}
                        >
                            <Preview />
                        </SandpackProvider>
                    </Box>
                </Container>
            </Stack>
        </div>
    );
}
