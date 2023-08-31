import { Container, Grid, Paper } from "@mui/material";
import Carousel from "react-multi-carousel";

import "react-multi-carousel/lib/styles.css";
import "./Slider.css";

import { sliderBoxProps } from "./Slider.styles";
import { colorSharp } from "@/assets";
import { ImageCard } from "@/components/common";
import { projectTemplates } from "@/data";

export default function Slider() {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    return (
        <Container
            component="section"
            className="slider"
            id="slider"
            maxWidth="xl"
            disableGutters
        >
            <Grid container spacing={2}>
                <Grid item xs>
                    <Paper component="div" sx={sliderBoxProps}>
                        <h2>Project Templates</h2>
                        <p>
                            Steeeee Sandbox provides plenty of templates for
                            JavaScript frameworks.<br></br> We are currently
                            working on templates in other programming languages.
                        </p>
                        <Carousel
                            responsive={responsive}
                            autoPlay
                            swipeable
                            draggable
                            infinite
                            arrows={false}
                            partialVisible={false}
                            transitionDuration={0.5}
                            className="slider-carousel"
                        >
                            {projectTemplates.map(({ label, image }, index) => (
                                <ImageCard
                                    key={index}
                                    image={{ src: image, height: "120px" }}
                                    elevation={0}
                                    sx={{
                                        maxWidth: "120px",
                                        backgroundColor: "inherit",
                                        marginX: "auto",
                                    }}
                                >
                                    <h3>{label}</h3>
                                </ImageCard>
                            ))}
                        </Carousel>
                    </Paper>
                </Grid>
            </Grid>
            <img className="slider-bg-image" src={colorSharp} alt="Image" />
        </Container>
    );
}
