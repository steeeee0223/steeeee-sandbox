import { User } from "firebase/auth";

import { PredefinedTemplate } from ".";

export type CreatedBy = Pick<User, "uid" | "displayName" | "email">;

export type Project = {
    projectId: string;
    name: string;
    template: PredefinedTemplate;
    tags: string[];
    createdBy: CreatedBy;
    lastModifiedAt: string;
};

export type ProjectAction =
    | "edit"
    | "demo"
    | "delete"
    | "rename"
    | "download"
    | null;

export type SelectedProject = {
    id: string;
    action: ProjectAction;
};
