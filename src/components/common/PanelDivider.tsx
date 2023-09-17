import { CSSProperties } from "react";
import { PanelResizeHandle } from "react-resizable-panels";

interface PanelDividerProps {
    direction: "horizontal" | "vertical";
}

export default function PanelDivider({ direction }: PanelDividerProps) {
    const dividerStyle: CSSProperties = {
        transitionDuration: "250ms",
        transitionTimingFunction: "linear",
        backgroundColor: "#bbb",
        outline: "none",
    };
    const style =
        direction === "vertical" ? { width: "1px" } : { height: "1px" };
    return <PanelResizeHandle style={{ ...dividerStyle, ...style }} />;
}
