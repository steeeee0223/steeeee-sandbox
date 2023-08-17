export type CreationType = "file" | "folder" | "upload" | null;

export interface CursorState {
    renameItem: string | null;
    creationType: CreationType;
    fileActionType: string | null;
    dashboardAction: "create" | null;
}
