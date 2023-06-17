import {
    ChangeEventHandler,
    FormEventHandler,
    forwardRef,
    useCallback,
    useState,
} from "react";
import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { useAppDispatch, useProjects } from "@/hooks";
import { deleteProjectsAsync, setProject } from "@/stores/project";

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

const DeleteForm = forwardRef(
    ({ projectName, projectId }: DeleteFormProps, ref) => {
        const { isProjectMatch } = useProjects();
        const dispatch = useAppDispatch();

        const [name, setName] = useState("");

        const handleSubmit: FormEventHandler = (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (
                name === projectName &&
                isProjectMatch(projectName, projectId)
            ) {
                dispatch(deleteProjectsAsync([projectId]));
                dispatch(setProject(null));
            } else {
                setName("");
                alert(`Wrong name!`);
            }
        };

        const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
            (e) => {
                e.stopPropagation();
                e.preventDefault();
                setName(e.currentTarget.value);
            },
            []
        );

        return (
            <Box
                tabIndex={-1} // will cause error if `tabIndex` is not set
                ref={ref}
                component="form"
                onSubmit={handleSubmit}
                onBlur={() => dispatch(setProject(null))}
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
                <FormControl fullWidth size="small">
                    <TextField
                        id="project-name"
                        label="Project Name"
                        value={name}
                        onChange={handleChange}
                        placeholder={projectName}
                        size="small"
                        autoFocus
                        required
                        sx={{ marginBottom: 2 }}
                    />
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<AutoAwesomeIcon />}
                    sx={{ height: 40 }}
                >
                    Submit
                </Button>
            </Box>
        );
    }
);

export default DeleteForm;
