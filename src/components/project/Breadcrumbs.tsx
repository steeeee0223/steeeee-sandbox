import * as React from "react";
import { Breadcrumbs as MuiBreadcrumbs, Chip, styled } from "@mui/material";

import { editorTabHeight } from "./styles";

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
        <MuiBreadcrumbs
            onClick={handleClick}
            role="presentation"
            maxItems={3}
            aria-label="breadcrumb"
            sx={{
                m: "12px",
                fontSize: "small",
                maxHeight: editorTabHeight / 2,
                flexGrow: 1,
            }}
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
    );
}
