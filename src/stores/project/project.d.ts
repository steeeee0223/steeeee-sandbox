export type Project = {
    projectId: string;
    name: string;
    tags: string[];
    createdBy: string;
    lastModifiedAt: Date;
};

export type ProjectAction = "edit" | "demo" | "delete" | "rename" | null;

export type SelectedProject = {
    id: string;
    action: ProjectAction;
};
