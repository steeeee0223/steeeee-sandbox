import type { UserCredential } from "firebase/auth";
import { DocumentSnapshot, QuerySnapshot } from "firebase/firestore";

import { sampleFiles, sampleFolders, sampleProjects, sampleUser } from "@/data";
import type { FileModel, FolderModel, ProjectModel } from "@/lib/storage";
import type { File, Folder, Project } from "@/types";

export const $user: UserCredential = {
    user: sampleUser,
    providerId: "google.com",
} as UserCredential;
export const $projectId = "test-project-id";

interface MockData<S, M> {
    state: S[];
    model: M[];
    docs: QuerySnapshot;
    one: {
        state: S;
        model: M;
        doc: DocumentSnapshot;
    };
}

const getDate = () => ({ createdAt: new Date(), updatedAt: new Date() });
const getSnapshot = <T = unknown, Snapshot = unknown>(id: string, payload: T) =>
    ({
        id,
        data: vi.fn().mockReturnValue(payload),
    } as unknown as Snapshot);

export const $projects: MockData<Project, ProjectModel> = {
    state: sampleProjects,
    model: sampleProjects.map(({ name, template, tags }) => ({
        name,
        template,
        tags,
        createdBy: sampleUser,
        ...getDate(),
    })),
    docs: sampleProjects.map(({ name, template, tags, projectId }) =>
        getSnapshot(projectId, {
            name,
            template,
            tags,
            createdBy: sampleUser,
            updatedAt: { seconds: 0, nanoseconds: 0 },
        })
    ) as unknown as QuerySnapshot,
    one: {
        state: sampleProjects[0],
        model: { ...sampleProjects[0], ...getDate() },
        doc: getSnapshot<unknown, DocumentSnapshot>(
            sampleProjects[0].projectId,
            {
                ...sampleProjects[0],
                updatedAt: { seconds: 0, nanoseconds: 0 },
            }
        ),
    },
};

export const $files: MockData<File, FileModel> = {
    state: sampleFiles,
    model: sampleFiles.map(({ parent, name, path, extension, content }) => ({
        parent,
        name,
        path,
        extension,
        content,
        projectId: $projectId,
        url: "URL",
        ...getDate(),
    })),
    docs: sampleFiles.map(
        ({ parent, name, path, extension, content, itemId }) =>
            getSnapshot(itemId, {
                parent,
                name,
                path,
                extension,
                content,
                projectId: $projectId,
            })
    ) as unknown as QuerySnapshot,
    one: {
        state: sampleFiles[0],
        model: {
            ...sampleFiles[0],
            projectId: $projectId,
            url: "URL",
            ...getDate(),
        },
        doc: getSnapshot<unknown, DocumentSnapshot>(sampleFiles[0].itemId, {
            ...sampleFiles[0],
            projectId: $projectId,
        }),
    },
};

export const $folders: MockData<Folder, FolderModel> = {
    state: sampleFolders,
    model: sampleFolders.map(({ parent, name, path }) => ({
        parent,
        name,
        path,
        projectId: $projectId,
        ...getDate(),
    })),
    docs: sampleFolders.map(({ parent, name, path, itemId }) =>
        getSnapshot(itemId, {
            parent,
            name,
            path,
            projectId: $projectId,
        })
    ) as unknown as QuerySnapshot,
    one: {
        state: sampleFolders[0],
        model: {
            ...sampleFolders[0],
            projectId: $projectId,
            ...getDate(),
        },
        doc: getSnapshot<unknown, DocumentSnapshot>(sampleFolders[0].itemId, {
            ...sampleFolders[0],
            projectId: $projectId,
        }),
    },
};

export const $bundledFiles = {
    "/components/App.tsx": sampleFiles[0].content,
    "/components/Routes.tsx": sampleFiles[1].content,
};
