import { SxProps } from "@mui/material";

export const bannerButtonProps: SxProps = {
    backgroundColor: "#ff00",
    fontWeight: 700,
    fontSize: "20px",
    marginTop: "60px",
    paddingX: "16px",
    letterSpacing: "0.8px",
    display: "flex",
    alignItems: "center",
    maxWidth: 220,

    ".MuiButton-endIcon": {
        fontSize: "25px",
        marginLeft: "10px",
        transition: "0.3s ease-in-out",
        lineHeight: 1,
        ":hover": { marginLeft: "25px" },
    },
};

export const bannerH1Props: SxProps = {
    fontSize: "92px",
    fontWeight: "700",
    letterSpacing: "0.8px",
    lineHeight: 1,
    marginBottom: "20px",
    display: "block",
};

export const bannerH3Props: SxProps = {
    fontSize: "48px",
    fontWeight: "700",
    letterSpacing: "0.8px",
    lineHeight: 1,
    marginY: "20px",
    display: "block",
};

export const bannerTextProps: SxProps = {
    color: "secondary.main",
    fontSize: "18px",
    letterSpacing: "0.8px",
    lineHeight: "1.5em",
    width: "96%",
};
