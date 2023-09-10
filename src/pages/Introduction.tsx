import { Container } from "@mui/material";

import {
    Banner,
    Contact,
    Features,
    Footer,
    ScrollUp,
    Slider,
} from "@/components/intro";

export default function Introduction() {
    return (
        <Container disableGutters maxWidth="xl">
            <Banner />
            <Features />
            <Slider />
            <Contact />
            <Footer />
            <ScrollUp />
        </Container>
    );
}
