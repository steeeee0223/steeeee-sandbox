import { Container, Grid } from "@mui/material";

import { contact } from "@/assets";
import ContactForm from "./ContactForm";
import { contactStyle } from "./Contact.styles";

export default function Contact() {
    return (
        <Container
            component="section"
            id="contact"
            sx={contactStyle}
            maxWidth="xl"
            disableGutters
        >
            <Grid
                container
                spacing={2}
                sx={{ marginX: 5, alignItems: "center" }}
            >
                <Grid item xs={12} md={6}>
                    <img src={contact} alt="contact" width="92%" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ContactForm />
                </Grid>
            </Grid>
        </Container>
    );
}
