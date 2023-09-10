import { useState } from "react";
import { IconButton } from "@mui/material";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { scrollUpProps } from "./ScrollUp.styles";

export default function ScrollUp() {
    const [showScroll, setShowScroll] = useState(false);

    window.addEventListener("scroll", () => {
        setShowScroll(window.scrollY >= 300);
    });

    return (
        <IconButton
            id="scroll"
            href="#"
            sx={{ ...scrollUpProps, bottom: showScroll ? "30px" : "-20%" }}
        >
            <KeyboardDoubleArrowUpIcon sx={{ fontSize: "1.5rem" }} />
        </IconButton>
    );
}
