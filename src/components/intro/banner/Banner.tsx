import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, Container, Grid } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

import "./Banner.css";
import { bannerButtonProps } from "./Banner.styles";
import { header } from "@/assets";

export default function Banner() {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState("");
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const [index, setIndex] = useState(1);
    const toRotate = ["with Steeeee...", "in Sandbox..."];
    const period = 2000;

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting
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
        let ticker = setInterval(() => {
            tick();
        }, delta);

        return () => {
            clearInterval(ticker);
        };
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
                    <h1>
                        {`Hi! Let's code`} <span className="wrap">{text}</span>
                    </h1>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book.
                    </p>
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
                    <img src={header} alt="header-img" />
                </Grid>
            </Grid>
        </Container>
    );
}
