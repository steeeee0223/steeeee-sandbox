import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, Container, Grid, Typography } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Lottie from "lottie-react";

import "./Banner.css";
import {
    bannerButtonProps,
    bannerH1Props,
    bannerH3Props,
    bannerTextProps,
} from "./Banner.styles";
import { coderDesktop } from "@/assets";

export default function Banner() {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState("");
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const [, setIndex] = useState(1);
    const toRotate = ["with me...", "in Sandbox..."];
    const period = 2000;

    const tick = () => {
        const i = loopNum % toRotate.length;
        const fullText = toRotate[i];
        const updatedText = isDeleting
            ? fullText.substring(0, text.length - 1)
            : fullText.substring(0, text.length + 1);

        setText(updatedText);

        if (isDeleting) {
            setDelta((prevDelta) => prevDelta / 2);
        }

        if (!isDeleting && updatedText === fullText) {
            setIsDeleting(true);
            setIndex((prevIndex) => prevIndex - 1);
            setDelta(period);
        } else if (isDeleting && updatedText === "") {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setIndex(1);
            setDelta(500);
        } else {
            setIndex((prevIndex) => prevIndex + 1);
        }
    };

    useEffect(() => {
        const ticker = setInterval(() => tick(), delta);
        return () => clearInterval(ticker);
    }, [text]);

    return (
        <Container
            component="section"
            maxWidth="xl"
            className="banner"
            id="home"
        >
            <Grid container spacing={2} sx={{ marginX: 5 }}>
                <Grid item xs={12} md={6} xl={7}>
                    <Typography component="h3" sx={bannerH3Props}>
                        Hi! I'm Steeeee.
                    </Typography>
                    <Typography component="h1" sx={bannerH1Props}>
                        {`Let's code`}
                        <br />
                        <span className="wrap">{text}</span>
                    </Typography>
                    <Typography component="p" sx={bannerTextProps}>
                        CodeSandbox keeps you in flow by giving you cloud
                        development environments that resume in 1 second.
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/login"
                        endIcon={<RocketLaunchIcon sx={{ fontSize: "25px" }} />}
                        sx={bannerButtonProps}
                    >
                        Get Started
                    </Button>
                </Grid>
                <Grid item xs={12} md={6} xl={5}>
                    <Lottie
                        animationData={coderDesktop}
                        className="banner-img"
                    />
                </Grid>
            </Grid>
        </Container>
    );
}
