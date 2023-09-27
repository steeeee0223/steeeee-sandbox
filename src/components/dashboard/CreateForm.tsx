import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import {
    Box,
    Button,
    FormControl,
    OutlinedInput,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { projectTemplates } from "@/data";
import { useProjects } from "@/hooks";
import { FormError, FormSelect } from "../common";

const formStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    alignContent: "center",
};

interface CreateFormProps {}

type CreateFormValues = {
    name: string;
    template: string;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
        },
    },
};

const CreateForm = forwardRef(({}: CreateFormProps, ref) => {
    const { isProjectPresent, create } = useProjects();
    const { handleSubmit, register, formState, control, reset } =
        useForm<CreateFormValues>({
            defaultValues: { name: "", template: "static" },
        });
    const { errors } = formState;

    const onSubmit = ({ name, template }: CreateFormValues) => {
        console.log(`[Form] got data: ${name} => ${template}`);
        create(name, template, reset);
    };

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
                New Project
            </Typography>
            <FormControl fullWidth size="small">
                <TextField
                    id="project-name"
                    label="Project Name"
                    {...register("name", {
                        required: "Project name is required",
                        validate: {
                            projectPresent: (value) =>
                                !isProjectPresent(value) ||
                                `Project name already present: ${value}`,
                        },
                    })}
                    placeholder="Project name..."
                    size="small"
                    autoFocus
                    required
                    sx={{ marginBottom: 2 }}
                />
            </FormControl>
            <Stack
                direction="row"
                spacing={3}
                useFlexGap
                flexWrap="wrap"
                sx={{ alignItems: "center", marginBottom: 2 }}
            >
                <FormSelect
                    name="template"
                    control={control}
                    label="Project Template"
                    options={projectTemplates}
                    FormControlProps={{ size: "small" }}
                    SelectProps={{
                        input: (
                            <OutlinedInput
                                label="Project Template"
                                size="small"
                                required
                                sx={{ width: 200 }}
                            />
                        ),
                        MenuProps,
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<AutoAwesomeIcon />}
                    sx={{ height: 40 }}
                >
                    Submit
                </Button>
            </Stack>
            <FormError errors={errors} sx={{ mb: 0 }} />
        </Box>
    );
});

export default CreateForm;
