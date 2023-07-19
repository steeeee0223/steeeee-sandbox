import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { FormControl, OutlinedInput, Box } from "@mui/material";

import { useAppDispatch, useProjects } from "@/hooks";
import { renameProjectAsync, setProject } from "@/stores/project";

interface RenameFormProps {
    projectId: string;
    placeholder?: string;
}

export default function RenameForm({
    projectId,
    placeholder,
}: RenameFormProps) {
    const { isProjectPresent } = useProjects();
    const dispatch = useAppDispatch();

    const [name, setName] = useState(placeholder ?? "");
    const invalidNames = [placeholder, ""];

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        e.stopPropagation();
        setName(e.currentTarget.value);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!invalidNames.includes(name)) {
            if (isProjectPresent(name)) {
                alert(`Project name ${name} is already present!`);
            } else {
                dispatch(renameProjectAsync({ projectId, name }));
            }
        }
        dispatch(setProject(null));
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            sx={{
                alignContent: "center",
            }}
        >
            <FormControl>
                <OutlinedInput
                    autoFocus
                    value={name}
                    onBlur={() => dispatch(setProject(null))}
                    onChange={handleChange}
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
