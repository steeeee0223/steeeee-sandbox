import { containerHeight } from "@/theme";
import { SxProps } from "@mui/material";

export const tabStyle: SxProps = {
    borderBottom: 1,
    borderColor: "divider",
};

export const editorTabHeight = 48;
export const editorBoxHeight = `calc(${containerHeight} - ${editorTabHeight}px - 2px)`;
export const editorPanelHeight = `calc(${containerHeight}  - ${editorTabHeight}px * 2)`;
export const workspaceHalfHeight = `calc(${containerHeight} / 2)`;
export const previewHeight = `calc(${workspaceHalfHeight} - ${editorTabHeight}px)`;
