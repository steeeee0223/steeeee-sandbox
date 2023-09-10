import { SxProps } from "@mui/material";
import { CSSProperties } from "react";

export const footerProps: SxProps = {
    margin: 0,
    padding: "0 0 50px 0",
    backgroundImage: `url("./src/assets/img/footer.png")`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
};

export const footerTextProps: CSSProperties = {
    fontWeight: 400,
    fontSize: "14px",
    letterSpacing: "0.5px",
    margin: "8px",
};

export const newsletterBoxProps: SxProps = {
    backgroundColor: "primary.main",
    borderRadius: "55px",
    color: "background.default",
    padding: "85px 125px",
    marginBottom: "80px",
    marginTop: "-122px",
};

export const newsletterHeaderProps: CSSProperties = {
    fontWeight: 700,
    fontSize: "22px",
    letterSpacing: "0.5px",
    lineHeight: "1.2em",
};

export const newsletterFormStyle: SxProps = {
    width: "80%",
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
};

export const newsletterInputStyle: SxProps = {
    width: "300px",
    color: "background.default",
    fontWeight: 500,
    background: "transparent",
    border: 0,
};

export const newsletterButtonStyle: SxProps = {
    background: "linear-gradient(90.21deg, #AA367C -5.91%, #4A2FBD 111.58%)",
    ml: 3,
    height: "40px",
    width: "130px",
    color: "primary.main",
    letterSpacing: "0.5px",
};
