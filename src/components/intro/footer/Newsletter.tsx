import {
    Alert,
    AlertColor,
    Button,
    Container,
    FormControl,
    Grid,
    Paper,
    TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { EmailFormFields, FormHooks } from "react-mailchimp-subscribe";

import {
    newsletterBoxProps,
    newsletterButtonStyle,
    newsletterFormStyle,
    newsletterHeaderProps,
    newsletterInputStyle,
} from "./Footer.styles";
import { FormError } from "@/components/common";

interface NewsletterFormValues {
    email: string;
}

export default function Newsletter({
    subscribe,
    status,
    message,
}: FormHooks<EmailFormFields>) {
    const { register, handleSubmit, reset, formState } =
        useForm<NewsletterFormValues>();
    const { errors } = formState;

    const onSubmit = ({ email }: NewsletterFormValues) => {
        console.log(`submitted`);
        subscribe({ EMAIL: email });
        reset();
    };

    const statusMap: Record<
        Exclude<typeof status, null>,
        { color: AlertColor; message: string }
    > = {
        sending: { color: "info", message: "Sending..." },
        error: { color: "warning", message: message?.toString() ?? "" },
        success: { color: "success", message: message?.toString() ?? "" },
    };

    return (
        <Container sx={newsletterBoxProps}>
            <Grid container spacing={5} textAlign="center">
                <Grid item lg={5} xl={5} md={6}>
                    <h3 style={newsletterHeaderProps}>
                        Subscribe to our Newsletter<br></br> & Never miss latest
                        updates
                    </h3>
                </Grid>
                <Grid item lg={7} xl={7} md={6}>
                    <Paper
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        autoComplete="off"
                        sx={newsletterFormStyle}
                    >
                        {status !== null && (
                            <Alert
                                severity={statusMap[status].color}
                                sx={{ mb: 2 }}
                            >
                                {statusMap[status].message}
                            </Alert>
                        )}
                        <FormError errors={errors} />
                        <FormControl size="small">
                            <TextField
                                id="email"
                                label="Email Address"
                                type="email"
                                {...register("email", {
                                    required: "Email is required!",
                                    pattern: {
                                        value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                        message: "Invalid email format!",
                                    },
                                    validate: {
                                        emtpyContent: (value) =>
                                            value.trim() !== "" ||
                                            `Email is required!`,
                                    },
                                })}
                                size="small"
                                sx={newsletterInputStyle}
                            />
                        </FormControl>
                        <Button type="submit" sx={newsletterButtonStyle}>
                            Submit
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
