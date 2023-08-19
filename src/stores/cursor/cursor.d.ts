export type DirectoryItemType = "file" | "folder";
export type CreationType = DirectoryItemType | "upload" | null;

export interface CursorState {
    renameItem: string | null;
    creationType: CreationType;
    fileActionType: string | null;
    dashboardAction: "create" | null;
}
