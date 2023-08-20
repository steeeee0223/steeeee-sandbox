export type DirectoryItemType = "file" | "folder";
export type CreationType = DirectoryItemType | "upload" | null;

export interface CursorState {
    creationType: CreationType;
    fileActionType: string | null;
    dashboardAction: "create" | null;
}
