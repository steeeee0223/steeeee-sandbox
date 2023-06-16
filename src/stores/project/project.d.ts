export type Project = {
    projectId: string;
    name: string;
    tags: string[];
    createdBy: string;
    lastModifiedAt: Date;
};

export type SelectedProject = {
    id: string;
    action: "edit" | "demo" | null;
};
