import { Container } from "@mui/material";

import { Banner, Contact, Footer, Slider } from "@/components/intro";

export default function Introduction() {
    return (
        <Container disableGutters maxWidth="xl">
            <Banner />
            <Slider />
            <Contact />
            <Footer />
        </Container>
    );
}
