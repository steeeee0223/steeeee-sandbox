import { Container, Grid, ToggleButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { logo } from "@/assets";
import { MAILCHIMP_API } from "@/config/env";
import { ButtonGroup } from "@/components/common";
import { footerProps, footerTextProps } from "./Footer.styles";
import Newsletter from "./Newsletter";

export default function Footer() {
    return (
        <Container
            component="footer"
            id="footer"
            sx={footerProps}
            maxWidth="xl"
            disableGutters
        >
            <Grid container>
                <Grid item xs={12} container>
                    <MailchimpSubscribe
                        url={MAILCHIMP_API}
                        render={(hooks) => <Newsletter {...hooks} />}
                    />
                </Grid>
                <Grid item xs={12} container spacing={5}>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                        <img src={logo} alt="Logo" width="30%" />
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "left" }}>
                        <ButtonGroup size="small">
                            <ToggleButton
                                component={RouterLink}
                                to={`#`}
                                value="github"
                            >
                                <GitHubIcon fontSize="small" />
                            </ToggleButton>
                            <ToggleButton
                                component={RouterLink}
                                to={`#`}
                                value="facebook"
                            >
                                <FacebookIcon fontSize="small" />
                            </ToggleButton>
                            <ToggleButton
                                component={RouterLink}
                                to={`#`}
                                value="instagram"
                            >
                                <InstagramIcon fontSize="small" />
                            </ToggleButton>
                            <ToggleButton
                                component={RouterLink}
                                to={`#`}
                                value="linkedIn"
                            >
                                <LinkedInIcon fontSize="small" />
                            </ToggleButton>
                        </ButtonGroup>
                        <p style={footerTextProps}>
                            © CopyRight 2022, All Right Reserved
                        </p>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}
