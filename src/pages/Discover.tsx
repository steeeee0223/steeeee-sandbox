import { Typography } from "@mui/material";

import { SearchForm } from "@/components/discover";

export default function Discover() {
    return (
        <>
            <h1>Discover</h1>
            <Typography variant="h6">Search for public projects</Typography>
            <SearchForm />
        </>
    );
}
