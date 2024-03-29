import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import {
    Box,
    Button,
    FormControl,
    Stack,
    TextField,
    Typography,
    capitalize,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useDirectory } from "@/hooks";
import { FormError } from "../common";

const formStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    alignContent: "center",
};

interface RenameFormProps {}

type RenameFormValues = { name: string };

const RenameForm = forwardRef(({}: RenameFormProps, ref) => {
    const { action, rename, getItem, isItemPresent } = useDirectory();
    const { name, isFolder, itemId, parent } = getItem(action.rename!.itemId);
    const type = isFolder ? "folder" : "file";
    const title = capitalize(type);

    const { register, handleSubmit, formState } = useForm<RenameFormValues>({
        defaultValues: { name },
    });
    const { errors } = formState;
    const onSubmit = ({ name }: RenameFormValues) => rename(type, itemId, name);

    return (
        <Box
            ref={ref}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
            sx={formStyle}
        >
            <Typography
                id="modal-title"
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", marginBottom: 3 }}
            >
                Rename {title}
            </Typography>
            <FormError errors={errors} />
            <Stack
                direction="row"
                spacing={2}
                useFlexGap
                flexWrap="wrap"
                sx={{ alignItems: "center", marginBottom: 2 }}
            >
                <FormControl size="small">
                    <TextField
                        id="rename"
                        label={`${title} Name`}
                        {...register("name", {
                            required: `${title} name is required!`,
                            validate: {
                                hasWhiteSpace: (name) =>
                                    !!name.trim() || `Invalid ${type} name`,
                                itemPresent: (name) =>
                                    !isItemPresent(type, parent, name) ||
                                    `${title} ${name.trim()} already present`,
                            },
                        })}
                        size="small"
                        autoFocus
                        fullWidth
                        sx={{ width: 220 }}
                    />
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<EditIcon />}
                    size="small"
                    sx={{ height: 40, width: 100 }}
                >
                    Submit
                </Button>
            </Stack>
        </Box>
    );
});

export default RenameForm;
