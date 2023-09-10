import { SxProps } from "@mui/material";
import { CSSProperties } from "react";

export const featuresProps: SxProps = {
    position: "relative",
    height: "100%",
};

export const featuresBoxProps: SxProps = {
    padding: "100px 120px",
    alignItems: "center",
    verticalAlign: "center",
};

export const featuresH1Props: CSSProperties = {
    width: "inherit",
    fontSize: "48px",
    fontWeight: "700",
    letterSpacing: "0.8px",
    lineHeight: "1.5em",

    marginTop: "10px",
    marginBottom: "30px",
    display: "block",
};

export const bgImageProps: CSSProperties = {
    position: "relative",
    top: "28%",
    bottom: 0,
    width: "40%",
    zIndex: -4,
};
