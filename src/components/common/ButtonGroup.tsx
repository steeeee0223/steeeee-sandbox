import { ToggleButtonGroup, styled } from "@mui/material";

const ButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    "& .MuiToggleButtonGroup-grouped": {
        "&.MuiToggleButton-root": {
            "&.MuiToggleButton-sizeSmall": {
                height: 25,
                width: 25,
            },
        },
        margin: theme.spacing(0.5),
        border: 0,
        "&.Mui-disabled": {
            border: 0,
        },
        "&:not(:first-of-type)": {
            borderRadius: theme.shape.borderRadius,
        },
        "&:first-of-type": {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));

export default ButtonGroup;
