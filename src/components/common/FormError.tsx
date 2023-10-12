import { Alert, SxProps } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import { FieldErrors, FieldValues } from "react-hook-form";

interface FormErrorProps<T extends FieldValues> {
    errors: FieldErrors<T>;
    sx?: SxProps;
}

export default function FormError<T extends FieldValues>({
    errors,
    sx,
}: FormErrorProps<T>) {
    let message = "";
    Object.entries(errors).forEach(([, desc]) => {
        if (message === "" && desc?.message) {
            message = desc?.message.toString();
        }
    });

    return message ? (
        <Alert
            icon={<BlockIcon />}
            severity="error"
            sx={sx ?? { background: "inherit", mb: 2 }}
        >
            {message}
        </Alert>
    ) : (
        <></>
    );
}
