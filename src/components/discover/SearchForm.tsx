import { Box, FormControl, OutlinedInput, Typography } from "@mui/material";
import { ChangeEventHandler, FormEventHandler, useState } from "react";

export default function SearchForm() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearchTerm(e.currentTarget.value);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
    };
    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
                autoFocus
                sx={{ alignContent: "center" }}
            >
                <FormControl>
                    <OutlinedInput
                        value={searchTerm}
                        onChange={handleChange}
                        sx={{
                            fontSize: 16,
                            height: "auto",
                            width: 500,
                            marginY: 3,
                            ".MuiOutlinedInput-input": {
                                padding: "10px",
                            },
                        }}
                    />
                </FormControl>
            </Box>
            <Typography component="span">
                Results for {searchTerm}...
            </Typography>
        </>
    );
}
