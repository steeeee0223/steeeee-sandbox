import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { FormControl, OutlinedInput, Box } from "@mui/material";

import { useAppDispatch, useDirectory } from "@/hooks";
import { setRenameItem } from "@/stores/cursor";
import { renameDirectoryItemAsync } from "@/stores/directory";

interface InputProps {
    itemId: string;
    placeholder?: string;
}

export default function Input({ itemId, placeholder }: InputProps) {
    const [name, setName] = useState(placeholder ?? "");
    const {
        item: { isFolder },
    } = useDirectory(itemId);
    const dispatch = useAppDispatch();

    const invalidNames = [placeholder, ""];

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setName(e.currentTarget.value);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(`Save new name to [${itemId}]: [${name}]`);
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
