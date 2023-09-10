import { Container, Grid } from "@mui/material";
import Lottie from "lottie-react";

import { coderScreen, lifeCycle, workflow, codeOnline } from "@/assets";
import {
    featuresBoxProps,
    featuresH1Props,
    featuresProps,
} from "./Features.styles";
import FeatureCard from "./FeatureCard";

const features = [
    {
        image: codeOnline,
        title: "Instant Web Developments",
        desc: "Run your code in powerful microVMs and build anything without limits. We configure your environment for you and keep your code always ready, behind a URL.",
    },
    {
        image: workflow,
        title: "Accelerate Your Git Workflow",
        desc: "Never wait for a dev server again. We make all your branches instantly available. Hop between branches and open PRs with our built-in git controls.",
    },
    {
        image: lifeCycle,
        title: "Shorten the Development Cycle",
        desc: "We give you a live dev environment for every PR. No need to switch context. Open the PR to see the code, tests and a preview, make any necessary changes, and merge it.",
    },
];

export default function Features() {
    return (
        <Container
            component="section"
            id="features"
            sx={featuresProps}
            maxWidth="xl"
            disableGutters
        >
            <Grid container spacing={4} sx={featuresBoxProps}>
                <Grid item xs={12} md={5}>
                    <Lottie animationData={coderScreen} />
                </Grid>
                <Grid item xs={12} md={7} container>
                    <Grid item xs={12}>
                        <h1 style={featuresH1Props}>
                            A live coding environment <br />
                            <span style={{ color: "#aa367c" }}>
                                in record time.
                            </span>
                        </h1>
                    </Grid>
                    {features.map((props, index) => (
                        <Grid key={index} item xs={12}>
                            <FeatureCard {...props} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            {/* <img src={colorSharp} alt="Image" style={bgImageProps} /> */}
        </Container>
    );
}
