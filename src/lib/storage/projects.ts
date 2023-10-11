import { CreatedBy, Project } from "@/types";
import {
    BaseDBModel,
    UnpackFunction,
    create,
    del,
    get,
    update,
} from "./fireStore";
import { Timestamp } from "firebase/firestore";

export interface ProjectModel extends BaseDBModel {
    name: string;
    template: string;
    tags: string[];
    createdBy: CreatedBy;
}

const $projectsCollection = "projects";
const unpackProject: UnpackFunction<Project> = (doc) => {
    const {
        name,
        template,
        tags,
        createdBy,
        updatedAt: { seconds, nanoseconds },
    } = doc.data()!;
    const project: Project = {
        projectId: doc.id,
        name,
        template,
        tags,
        createdBy,
        lastModifiedAt: new Timestamp(seconds, nanoseconds)
            .toDate()
            .toUTCString(),
    };
    return project;
};

export const getProjects = async (userId: string) =>
    await get<Project, ProjectModel>($projectsCollection, unpackProject, {
        "createdBy.uid": userId,
    });

export const createProject = async (data: Partial<ProjectModel>) =>
    await create<Project, ProjectModel>(
        $projectsCollection,
        data,
        unpackProject
    );

export const updateProject = async (id: string, data: Partial<ProjectModel>) =>
    await update<Project, ProjectModel>(
        $projectsCollection,
        id,
        data,
        unpackProject
    );

export const deleteProjects = async (ids: string[]) =>
    await del($projectsCollection, ids);

export default {
    getAll: getProjects,
    create: createProject,
    update: updateProject,
    delete: deleteProjects,
};
