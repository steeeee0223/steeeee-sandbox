export type Project = { id: string; userId: string };

export type SelectedProject = {
    id: string;
    action: "edit" | "demo" | null;
};
