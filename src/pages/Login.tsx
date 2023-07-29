import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useAuth } from "@/hooks";

const center = {
    alignItems: "center",
    justifyContent: "center",
};

export default function Login() {
    const navigate = useNavigate();
    const { user, googleSignIn, githubSignIn } = useAuth();

    useEffect(() => {
        if (user !== null) navigate("/home");
    }, [user]);

    return (
        <Container sx={{ display: "flex", ...center }}>
            <Paper elevation={6} sx={{ marginTop: 3, padding: 3 }}>
                <h1 style={{ display: "flex", ...center }}>Login</h1>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Choose a method to login
                </Typography>
                <Stack spacing={3} sx={center}>
                    <Button
                        onClick={googleSignIn}
                        startIcon={<GoogleIcon />}
                        variant="contained"
                        color="success"
                        sx={{ width: 150 }}
                    >
                        Google
                    </Button>
                    <Button
                        onClick={githubSignIn}
                        startIcon={<GitHubIcon />}
                        variant="contained"
                        color="warning"
                        sx={{ width: 150 }}
                    >
                        GitHub
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}
