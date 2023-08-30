import { Alert } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import { FieldErrors, FieldValues } from "react-hook-form";

interface FormErrorProps<T extends FieldValues> {
    errors: FieldErrors<T>;
    bgColor?: string;
}

export default function FormError<T extends FieldValues>({
    errors,
    bgColor,
}: FormErrorProps<T>) {
    let message = "";
    Object.entries(errors).forEach(([name, desc]) => {
        if (message === "" && desc?.message) {
            message = desc?.message.toString();
        }
    });

    return message ? (
        <Alert
            icon={<BlockIcon />}
            severity="error"
            sx={{ background: bgColor ?? "inherit" }}
        >
            {message}
        </Alert>
    ) : (
        <></>
    );
}
