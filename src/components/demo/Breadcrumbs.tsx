import * as React from "react";
import { shallowEqual } from "react-redux";
import { Breadcrumbs as MuiBreadcrumbs, Chip } from "@mui/material";
import { styled, emphasize } from "@mui/material/styles";

import { RootState, useAppSelector, useDirectory } from "@/hooks";

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
}

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        "&:active": { boxShadow: theme.shadows[1] },
    };
}) as typeof Chip;

export default function Breadcrumbs() {
    const {
        currentItem: { path, item },
    } = useDirectory();

    return (
        <div role="presentation" onClick={handleClick}>
            <MuiBreadcrumbs
                maxItems={3}
                aria-label="breadcrumb"
                sx={{ marginBottom: 2, fontSize: "small" }}
            >
                {path.name.map((name, index) => (
                    <StyledBreadcrumb
                        key={index}
                        component="a"
                        label={name}
                        href="#"
                    />
                ))}
                {item.name && (
                    <StyledBreadcrumb
                        component="a"
                        label={item.name}
                        href="#"
                    />
                )}
            </MuiBreadcrumbs>
        </div>
    );
}
