import firestore, {
    DocumentSnapshot,
    deleteDoc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore";

import { mockedFiles, mockedProjectId } from "#/mock";
import { createFile, deleteFiles, getFiles, updateFile } from "./files";

describe("Files Storage", () => {
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

    it("getFiles should resolve promise", async () => {
        const mock = vi.mocked(getDocs).mockResolvedValue(mockedFiles.docs);
        const results = await getFiles(mockedProjectId);
        expect(mock).toHaveBeenCalled();
        expect(results.length).toBe(mockedFiles.model.length);
    });

    it("createFile should resolve promise", async () => {
        const file = mockedFiles.one;
        const { name, parent, path, content, extension } = file.model;
        const mock = vi.mocked(getDoc).mockResolvedValue(file.doc);

        const result = await createFile({
            name,
            parent,
            path,
            content,
            extension,
        });
        expect(vi.mocked(setDoc)).toHaveBeenCalled();
        expect(mock).toHaveBeenCalled();
        expect(result.itemId).toBe(file.doc.id);
        expect(result.name).toBe(name);
    });

    it("updateFile should resolve promise", async () => {
        const file = mockedFiles.one;
        const mockInput = { name: `${file.model.name}-2` };
        const mock = vi.mocked(getDoc).mockResolvedValue({
            ...file.doc,
            data: vi
                .fn()
                .mockReturnValue({ ...file.model, name: mockInput.name }),
        } as unknown as DocumentSnapshot);

        const result = await updateFile(file.doc.id, mockInput);
        expect(vi.mocked(updateDoc)).toHaveBeenCalled();
        expect(mock).toHaveBeenCalled();
        expect(result.itemId).toBe(file.doc.id);
        expect(result.name).toBe(mockInput.name);
    });

    it("deleteFiles should resolve promise", async () => {
        const mock = vi.mocked(deleteDoc);
        await deleteFiles(["id1", "id2"]);
        expect(mock).toHaveBeenCalledTimes(2);
    });
});
