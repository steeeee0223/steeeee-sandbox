import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { FormControl, OutlinedInput, Box } from "@mui/material";

import { useAppDispatch, useDirectory } from "@/hooks";
import { setRenameItem } from "@/stores/cursor";
import { renameDirectoryItemAsync } from "@/stores/directory";

interface RenameFormProps {
    itemId: string;
    placeholder?: string;
}

export default function RenameForm({ itemId, placeholder }: RenameFormProps) {
    const {
        item: { isFolder },
    } = useDirectory(itemId);
    const dispatch = useAppDispatch();

    const [name, setName] = useState(placeholder ?? "");
    const invalidNames = [placeholder, ""];

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        e.stopPropagation();
        setName(e.currentTarget.value);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!invalidNames.includes(name))
            dispatch(renameDirectoryItemAsync({ isFolder, itemId, name }));
        dispatch(setRenameItem(null));
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            autoFocus
            sx={{
                alignContent: "center",
            }}
        >
            <FormControl>
                <OutlinedInput
                    value={name}
                    onBlur={() => dispatch(setRenameItem(null))}
                    onChange={handleChange}
                    sx={{
                        fontSize: 12,
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
