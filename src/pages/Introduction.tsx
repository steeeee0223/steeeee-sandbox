import { Container } from "@mui/material";

import { Banner, Slider } from "@/components/intro";

export default function Introduction() {
    return (
        <Container disableGutters sx={{ marginX: 0, minWidth: "100vw" }}>
            <Banner />
            <Slider />
        </Container>
    );
}
