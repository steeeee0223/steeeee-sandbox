import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Container, Stack, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useAppDispatch, useAuth } from "@/hooks";
import { githubSignIn, googleSignIn } from "@/stores/auth";

export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user !== null) navigate("/home");
    }, [user]);

    return (
        <Container sx={{}}>
            <h1>Login</h1>
            <Stack direction="row" spacing={3}>
                <Button
                    onClick={() => dispatch(googleSignIn())}
                    startIcon={<GoogleIcon />}
                    variant="contained"
                    color="success"
                >
                    Google
                </Button>
                <Button
                    onClick={() => dispatch(githubSignIn())}
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
