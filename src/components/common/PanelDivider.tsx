import { PanelResizeHandle } from "react-resizable-panels";

import styles from "./PanelDivider.module.css";
interface PanelDividerProps {
    direction: "horizontal" | "vertical";
}

export default function PanelDivider({ direction }: PanelDividerProps) {
    return (
        <PanelResizeHandle
            className={
                direction === "vertical"
                    ? styles.ResizableHandleVertical
                    : styles.ResizableHandleHorizontal
            }
        />
    );
}
