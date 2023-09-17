import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import {
    Box,
    Button,
    FormControl,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useAppDispatch, useProjects } from "@/hooks";
import { deleteProjectsAsync } from "@/stores/project";
import { FormError } from "../common";

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

interface DeleteFormProps {
    projectName: string;
    projectId: string;
}

type DeleteFormValues = { name: string };

const DeleteForm = forwardRef(
    ({ projectName, projectId }: DeleteFormProps, ref) => {
        const dispatch = useAppDispatch();
        const { user, isProjectMatch, resetProject } = useProjects();
        const { register, handleSubmit, formState, reset } =
            useForm<DeleteFormValues>();
        const { errors } = formState;

        const onSubmit = () => {
            if (user) {
                dispatch(
                    deleteProjectsAsync({
                        userId: user.uid,
                        projectIds: [projectId],
                    })
                );
                resetProject();
                reset();
            }
        };

        return (
            <Box
                tabIndex={-1} // will cause error if `tabIndex` is not set
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
                    Delete project
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ marginBottom: 3 }}
                >
                    Enter the project name{" "}
                    <Typography component="span" sx={{ fontWeight: "bold" }}>
                        {projectName}
                    </Typography>{" "}
                    to delete
                </Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    useFlexGap
                    flexWrap="wrap"
                    sx={{ alignItems: "center", marginBottom: 2 }}
                >
                    <FormControl size="small">
                        <TextField
                            id="project-name"
                            label="Project Name"
                            {...register("name", {
                                required: "Project name is required",
                                validate: {
                                    projectPresent: (value) =>
                                        (value === projectName &&
                                            isProjectMatch(value, projectId)) ||
                                        `Project name not matched: ${value}`,
                                },
                            })}
                            placeholder={projectName}
                            size="small"
                            autoFocus
                            fullWidth
                            sx={{ width: 220 }}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        endIcon={<DeleteIcon />}
                        sx={{ height: 40, width: 100 }}
                    >
                        Delete
                    </Button>
                </Stack>
                <FormError errors={errors} sx={{ mb: 0 }} />
            </Box>
        );
    }
);

export default DeleteForm;
