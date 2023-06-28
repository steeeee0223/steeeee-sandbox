import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Stack, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useAuthContext } from "@/contexts/auth";

export default function Login() {
    const { user, googleSignIn, githubSignIn } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (user !== null) navigate("/home");
    }, [user]);

    return (
        <Container sx={{}}>
            <Typography variant="h3">Login</Typography>
            <Stack direction="row" spacing={3}>
                <Button
                    onClick={googleSignIn}
                    startIcon={<GoogleIcon />}
                    variant="contained"
                    color="success"
                >
                    Google
                </Button>
                <Button
                    onClick={githubSignIn}
                    startIcon={<GitHubIcon />}
                    variant="contained"
                    color="warning"
                >
                    GitHub
                </Button>
            </Stack>
        </Container>
    );
}
