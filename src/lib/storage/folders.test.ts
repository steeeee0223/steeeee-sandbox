import firestore, {
    DocumentSnapshot,
    deleteDoc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore";

import { mockedFolders, mockedProjectId } from "#/mock";
import {
    createFolder,
    deleteFolders,
    getFolders,
    updateFolder,
} from "./folders";

describe("Folders Storage", () => {
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

    it("getFolders should resolve promise", async () => {
        const mock = vi.mocked(getDocs).mockResolvedValue(mockedFolders.docs);
        const results = await getFolders(mockedProjectId);
        expect(mock).toHaveBeenCalled();
        expect(results.length).toBe(mockedFolders.model.length);
    });

    it("createFolder should resolve promise", async () => {
        const folder = mockedFolders.one;
        const { name, parent, path } = folder.model;
        const mock = vi.mocked(getDoc).mockResolvedValue(folder.doc);

        const result = await createFolder({ name, parent, path });
        expect(vi.mocked(setDoc)).toHaveBeenCalled();
        expect(mock).toHaveBeenCalled();
        expect(result.itemId).toBe(folder.doc.id);
        expect(result.name).toBe(name);
    });

    it("updateFolder should resolve promise", async () => {
        const folder = mockedFolders.one;
        const mockInput = { name: `${folder.model.name}-2` };
        const mock = vi.mocked(getDoc).mockResolvedValue({
            ...folder.doc,
            data: vi
                .fn()
                .mockReturnValue({ ...folder.model, name: mockInput.name }),
        } as unknown as DocumentSnapshot);

        const result = await updateFolder(folder.doc.id, mockInput);
        expect(vi.mocked(updateDoc)).toHaveBeenCalled();
        expect(mock).toHaveBeenCalled();
        expect(result.itemId).toBe(folder.doc.id);
        expect(result.name).toBe(mockInput.name);
    });

    it("deleteFolders should resolve promise", async () => {
        const mock = vi.mocked(deleteDoc);
        await deleteFolders(["id1", "id2"]);
        expect(mock).toHaveBeenCalledTimes(2);
    });
});
