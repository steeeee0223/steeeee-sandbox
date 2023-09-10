import { Grid, Typography } from "@mui/material";
import Lottie from "lottie-react";

interface FeatureCardProps {
    image: unknown;
    title: string;
    desc: string;
}

export default function FeatureCard({ image, title, desc }: FeatureCardProps) {
    return (
        <Grid
            container
            spacing={2}
            sx={{
                alignItems: "center",
                verticalAlign: "center",
                margin: 0,
                marginBottom: 3,
            }}
        >
            <Grid item xs={2} sx={{ textAlign: "center" }}>
                <Lottie animationData={image} color="#FFF" />
            </Grid>
            <Grid item xs={10}>
                <Typography
                    component="h3"
                    style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        marginBottom: "6px",
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    component="p"
                    color="secondary"
                    sx={{ width: "90%" }}
                >
                    {desc}
                </Typography>
            </Grid>
        </Grid>
    );
}
