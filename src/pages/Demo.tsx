import { useEffect } from "react";
import { Box, Container, Divider, Stack, Typography } from "@mui/material";

import { Workspace } from "@/components/demo";
import { Frame } from "@/components/common";
import { sampleCode } from "@/data";
import { useAppDispatch, usePath } from "@/hooks";
import { setProject } from "@/stores/project";

export default function Demo() {
    const {
        path: [, , projectId],
    } = usePath();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setProject({ id: projectId ?? null, action: "demo" }));
    }, [projectId]);

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
                        <Frame code={sampleCode} />
                    </Box>
                </Container>
            </Stack>
        </div>
    );
}
