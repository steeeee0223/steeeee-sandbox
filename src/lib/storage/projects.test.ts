import firestore, {
    DocumentSnapshot,
    deleteDoc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore";

import { mockedProjects, mockedUser } from "#/mock";
import {
    createProject,
    deleteProjects,
    getProjects,
    updateProject,
} from "./projects";

describe("Projects Storage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mock("firebase/firestore", async () => {
            const actual = await vi.importActual<typeof firestore>(
                "firebase/firestore"
            );
            return {
                ...actual,
                getFirestore: vi.fn(),
                collection: vi.fn(),
                where: vi.fn(),
                query: vi.fn(),
                getDocs: vi.fn(),
                getDoc: vi.fn(),
                setDoc: vi.fn(),
                updateDoc: vi.fn(),
                deleteDoc: vi.fn(),
                doc: vi.fn(),
            };
        });
    });

    it("getProjects should resolve promise", async () => {
        const mock = vi.mocked(getDocs).mockResolvedValue(mockedProjects.docs);

        const results = await getProjects(mockedUser.user.uid);
        expect(mock).toHaveBeenCalled();
        expect(results.length).toBe(mockedProjects.model.length);
    });

    it("createProject should resolve promise", async () => {
        const project = mockedProjects.one;
        const { name, template, createdBy, tags } = project.model;
        const mock = vi.mocked(getDoc).mockResolvedValue(project.doc);

        const result = await createProject({ name, template, createdBy, tags });
        expect(vi.mocked(setDoc)).toHaveBeenCalled();
        expect(mock).toHaveBeenCalled();
        expect(result.projectId).toBe(project.doc.id);
        expect(result.name).toBe(name);
        // expect(result).toBe(project.state);
    });

    it("updateProject should resolve promise", async () => {
        const project = mockedProjects.one;
        const mockInput = { name: `${project.model.name}-2` };
        const mock = vi.mocked(getDoc).mockResolvedValue({
            ...project.doc,
            data: vi
                .fn()
                .mockReturnValue({ ...project.model, name: mockInput.name }),
        } as unknown as DocumentSnapshot);

        const result = await updateProject(project.doc.id, mockInput);
        expect(vi.mocked(updateDoc)).toHaveBeenCalled();
        expect(mock).toHaveBeenCalled();
        expect(result.projectId).toBe(project.doc.id);
        expect(result.name).toBe(mockInput.name);
    });

    it("deleteProjects should resolve promise", async () => {
        const mock = vi.mocked(deleteDoc);
        await deleteProjects(["id1", "id2"]);
        expect(mock).toHaveBeenCalledTimes(2);
    });
});
