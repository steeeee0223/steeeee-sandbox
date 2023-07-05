import { CSSProperties } from "react";
import { Box, SvgIcon, SxProps } from "@mui/material";

import { ReactComponent as AlzheimerIcon } from "../../assets/alzheimer.svg";

const center: SxProps = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

interface NotFoundProps {
    message: string;
}

export default function NotFound({ message }: NotFoundProps) {
    return (
        <>
            <h1 style={center as CSSProperties}>{message}</h1>
            <Box sx={center}>
                <SvgIcon sx={{ fontSize: 200 }}>
                    <AlzheimerIcon />
                </SvgIcon>
            </Box>
        </>
    );
}
