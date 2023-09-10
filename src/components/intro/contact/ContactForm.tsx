import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, FormControl, Grid, TextField } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SendIcon from "@mui/icons-material/Send";

import { FormError } from "@/components/common";
import { formHeaderStyle, formStyle } from "./Contact.styles";

interface ContactFormValues {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}

const ContactForm = () => {
    const [success, setSuccess] = useState(false);
    const { register, handleSubmit, formState, reset } =
        useForm<ContactFormValues>();
    const { errors } = formState;

    const onSubmit = () => {
        console.log(`submit contact form`);
        setSuccess(true);
        setTimeout(() => {
            reset();
            setSuccess(false);
        }, 3000);
    };

    return (
        <Grid
            container
            spacing={2}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
            sx={formStyle}
        >
            <h2 style={formHeaderStyle}>Get In Touch</h2>
            {success && (
                <Grid item xs={12} md={12}>
                    <Alert
                        severity="success"
                        icon={<CheckBoxIcon />}
                        sx={{ backgroundColor: "inherit" }}
                    >
                        Mail sent!
                    </Alert>
                </Grid>
            )}
            <Grid item xs={12} md={12}>
                <FormError errors={errors} />
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl size="small">
                    <TextField
                        id="firstName"
                        label="First Name"
                        {...register("firstName", {
                            required: "First name is required!",
                            validate: {
                                emtpyContent: (value) =>
                                    value.trim() !== "" ||
                                    `First name is required!`,
                            },
                        })}
                        sx={{ width: { lg: "225px" } }}
                        size="small"
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl size="small">
                    <TextField
                        id="lastName"
                        label="Last Name"
                        {...register("lastName", {
                            required: "Last name is required!",
                            validate: {
                                emtpyContent: (value) =>
                                    value.trim() !== "" ||
                                    `Last name is required!`,
                            },
                        })}
                        size="small"
                        sx={{ width: { lg: "225px" } }}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
                <FormControl size="small">
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        {...register("email", {
                            required: "Email is required!",
                            pattern: {
                                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                message: "Invalid email format!",
                            },
                            validate: {
                                emtpyContent: (value) =>
                                    value.trim() !== "" || `Email is required!`,
                            },
                        })}
                        size="small"
                        sx={{ width: { lg: "480px" } }}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
                <FormControl size="small">
                    <TextField
                        id="message"
                        label="Message"
                        multiline
                        {...register("message", {
                            required: "Message is required",
                            validate: {
                                emtpyContent: (value) =>
                                    value.trim() !== "" ||
                                    `Message is required`,
                            },
                        })}
                        size="small"
                        minRows={3}
                        sx={{ width: { lg: "480px" } }}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{ height: 40 }}
                >
                    Submit
                </Button>
            </Grid>
        </Grid>
    );
};

export default ContactForm;
