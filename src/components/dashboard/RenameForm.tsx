import { useForm } from "react-hook-form";
import { FormControl, OutlinedInput, Box } from "@mui/material";

import { useAppDispatch, useProjects } from "@/hooks";
import { renameProjectAsync } from "@/stores/project";

interface RenameFormProps {
    projectId: string;
    placeholder?: string;
}

type RenameFormValues = { name: string };

export default function RenameForm({
    projectId,
    placeholder,
}: RenameFormProps) {
    const { isProjectPresent, resetProject } = useProjects();
    const dispatch = useAppDispatch();
    const { register, handleSubmit } = useForm<RenameFormValues>({
        defaultValues: { name: placeholder },
    });

    const onSubmit = ({ name }: RenameFormValues) => {
        if (name !== placeholder) {
            dispatch(renameProjectAsync({ projectId, name }));
        }
        resetProject();
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
            sx={{ alignContent: "center" }}
        >
            <FormControl>
                <OutlinedInput
                    autoFocus
                    {...register("name", {
                        required: "Project name is required",
                        validate: {
                            projectPresent: (value) =>
                                !isProjectPresent(value) ||
                                `Project name already present: ${value}`,
                        },
                        onBlur: resetProject,
                    })}
                    sx={{
                        fontSize: "small",
                        height: "auto",
                        ".MuiOutlinedInput-input": {
                            padding: "5px",
                        },
                    }}
                />
            </FormControl>
        </Box>
    );
}
