import { alpha } from "@mui/material/styles";
import { IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import { tableTitle } from "@/data";
import { HeaderToolbar } from "./Toolbars";

export default function TableToolbar(props: TableToolbarProps) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                        ),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {tableTitle}
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Cancel">
                    <IconButton>
                        <CancelIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <HeaderToolbar />
            )}
        </Toolbar>
    );
}
