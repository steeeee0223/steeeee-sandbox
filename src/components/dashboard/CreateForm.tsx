import {
    ChangeEventHandler,
    FormEventHandler,
    forwardRef,
    useCallback,
    useState,
} from "react";
import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";

import { projectTemplates } from "@/data";
import { useAppDispatch, useProjects } from "@/hooks";
import { createProjectAsync } from "@/stores/project";
import { setDashboardAction } from "@/stores/cursor";

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

const CreateForm = forwardRef(({}: CreateFormProps, ref) => {
    const dispatch = useAppDispatch();
    const { user, isProjectPresent } = useProjects();

    const [name, setName] = useState("");
    const [template, setTemplate] =
        useState<SandpackPredefinedTemplate>("static");

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (user && name && template) {
            if (!isProjectPresent(name)) {
                const { uid, displayName, email } = user;
                const data = {
                    createdAt: new Date(),
                    lastModifiedAt: new Date(),
                    template,
                    name,
                    tags: [template],
                };
                dispatch(
                    createProjectAsync({
                        user: { uid, displayName, email },
                        data,
                    })
                );
                dispatch(setDashboardAction(null));
            } else {
                alert(`Project name already present: ${name}`);
                setName("");
            }
        } else {
            alert(`All fields are required`);
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

    const handleTemplateChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        setTemplate(e.target.value as SandpackPredefinedTemplate);
    };

    return (
        <Box
            ref={ref}
            component="form"
            onSubmit={handleSubmit}
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
                    value={name}
                    onChange={handleChange}
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
                sx={{ alignItems: "center" }}
            >
                <FormControl size="small">
                    <TextField
                        select
                        id="project-template"
                        label="Project Template"
                        value={template}
                        onChange={handleTemplateChange}
                        size="small"
                        required
                        sx={{ width: 200 }}
                    >
                        {projectTemplates.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<AutoAwesomeIcon />}
                    sx={{ height: 40 }}
                >
                    Submit
                </Button>
            </Stack>
        </Box>
    );
});

export default CreateForm;
