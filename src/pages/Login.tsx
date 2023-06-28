import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Container, Stack, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { githubSignIn, googleSignIn } from "@/stores/auth";

export default function Login() {
    const { user } = useAppSelector(
        (state) => ({ user: state.auth.user }),
        shallowEqual
    );
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user !== null) navigate("/home");
    }, [user]);

    return (
        <Container sx={{}}>
            <Typography variant="h3">Login</Typography>
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
