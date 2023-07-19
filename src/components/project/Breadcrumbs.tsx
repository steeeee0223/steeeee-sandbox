import * as React from "react";
import { Breadcrumbs as MuiBreadcrumbs, Chip } from "@mui/material";
import { styled, emphasize } from "@mui/material/styles";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        height: theme.spacing(3),
        fontWeight: theme.typography.fontWeightRegular,
        "&:active": {
            boxShadow: theme.shadows[1],
        },
    };
}) as typeof Chip;

interface BreadcrumbsProps {
    path: string[];
}

export default function Breadcrumbs({ path }: BreadcrumbsProps) {
    const handleClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        console.info("You clicked a breadcrumb.");
    };

    return (
        <div role="presentation" onClick={handleClick}>
            <MuiBreadcrumbs
                maxItems={3}
                aria-label="breadcrumb"
                sx={{ m: 2, fontSize: "small" }}
            >
                {path.map((name, index) => (
                    <StyledBreadcrumb
                        key={index}
                        component="a"
                        label={name}
                        href="#"
                    />
                ))}
            </MuiBreadcrumbs>
        </div>
    );
}
