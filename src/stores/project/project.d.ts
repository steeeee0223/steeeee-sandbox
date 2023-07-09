import { User } from "firebase/auth";

export type CreatedBy = Pick<User, "uid" | "displayName" | "email">;

export type Project = {
    projectId: string;
    name: string;
    tags: string[];
    createdBy: CreatedBy;
    lastModifiedAt: Date;
};

export type ProjectAction = "edit" | "demo" | "delete" | "rename" | null;

export type SelectedProject = {
    id: string;
    action: ProjectAction;
};
