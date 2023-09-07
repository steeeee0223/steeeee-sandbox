import { Container } from "@mui/material";

import { Banner, Contact, Features, Footer, Slider } from "@/components/intro";

export default function Introduction() {
    return (
        <Container disableGutters maxWidth="xl">
            <Banner />
            <Features />
            <Slider />
            <Contact />
            <Footer />
        </Container>
    );
}
