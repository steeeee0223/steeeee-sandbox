import storage from "firebase/storage";
import { act } from "react-dom/test-utils";

import { ExtendedRenderOptions, renderHookWithProviders } from "#/utils";
import {
    $projectSelectedState,
    $bundledFiles,
    $files,
    $folders,
    $projectId,
    $user,
} from "#/mock";
import { getDefaultFile } from "@/lib/file";
import { filesDB, foldersDB, storageDB } from "@/lib/storage";
import {
    DirectoryAction,
    DirectoryItem,
    DirectoryItemType,
    File,
    Folder,
    UploadFile,
} from "@/types";
import { useDirectory } from "./directory";

const options: ExtendedRenderOptions = {
    preloadedState: $projectSelectedState,
};

describe(useDirectory, () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mock("firebase/storage", async () => {
            const actual = await vi.importActual<typeof storage>(
                "firebase/storage"
            );
            return {
                ...actual,
                getDownloadURL: vi.fn().mockResolvedValue("FAKE-URL"),
            };
        });
        vi.mock("@/lib/storage", () => ({
            storageDB: {
                create: vi.fn(),
                rename: vi.fn(),
                delete: vi.fn(),
            },
            foldersDB: {
                getAll: vi.fn(),
                create: vi.fn(),
                update: vi.fn(),
                delete: vi.fn(),
            },
            filesDB: {
                getAll: vi.fn(),
                create: vi.fn(),
                update: vi.fn(),
                delete: vi.fn(),
            },
        }));
    });
    /** Helper functions */
    const mockCreate = (
        parent: string,
        type: "folder" | "file" | "upload",
        name: string
    ) => {
        switch (type) {
            case "folder":
                vi.mocked(foldersDB.create).mockResolvedValue({
                    parent,
                    name,
                    isFolder: true,
                    children: [],
                    itemId: "test-id",
                    path: [],
                });
                break;
            default:
                vi.mocked(filesDB.create).mockResolvedValue({
                    parent,
                    name,
                    isFolder: false,
                    itemId: "test-id",
                    path: [],
                    extension: "",
                    content: "",
                });
                break;
        }
    };
    const mockRename = (
        type: "folder" | "file",
        item: DirectoryItem,
        newName: string
    ): DirectoryItem => {
        const newItem = { ...item, name: newName };
        switch (type) {
            case "folder":
                vi.mocked(foldersDB.update).mockResolvedValue(
                    newItem as Folder
                );
                break;
            case "file":
                vi.mocked(filesDB.update).mockResolvedValue(newItem as File);
                break;
        }
        return newItem;
    };
    /** [initial] */
    it("[initial] should return a selected project and an initial state", () => {
        const { result } = renderHookWithProviders(useDirectory, options);
        expect(result.current.project.projectId).toBe($projectId);
        expect(result.current.directory).toEqual([]);
        expect(result.current.currentItem.item.id).toBe("root");
        expect(result.current.action).toEqual({});
    });
    /** [get] */
    describe("[get]", async () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });
        vi.mocked(foldersDB.getAll).mockResolvedValue($folders.state);
        vi.mocked(filesDB.getAll).mockResolvedValue($files.state);
        const { result } = renderHookWithProviders(useDirectory, options);

        /** Load all directory items */
        await act(() => result.current.reload($user.user.uid, $projectId));
        /** [Reload] */
        it("[reload] should load project directory", async () => {
            const [folders, files] = [$folders.state, $files.state];
            expect(result.current.directory.length).toBe(
                folders.length + files.length
            );
        });
        /** [isItemPresent] */
        it.each<{
            type: "folder" | "file";
            itemId: string;
            name: string;
            expected: boolean;
        }>([
            { type: "folder", itemId: "root", name: "pages", expected: true },
            {
                type: "folder",
                itemId: "root",
                name: "test-name",
                expected: false,
            },
            {
                type: "file",
                itemId: "components",
                name: "App.tsx",
                expected: true,
            },
            {
                type: "file",
                itemId: "components",
                name: "test-name",
                expected: false,
            },
        ])(
            "[isItemPresent:$type] item $name already exists under $itemId: $expected",
            async ({ type, itemId, name, expected }) => {
                /** Check presence */
                const isPresent = await act(() =>
                    result.current.isItemPresent(type, itemId, name)
                );
                expect(isPresent).toBe(expected);
            }
        );
        /** [getFolders/getFiles] */
        it("[getFolders/getFiles] should select all folders/files from the project", async () => {
            /** Get all folders */
            const folders = await act(result.current.getFolders);
            expect(folders.length).toBe($folders.state.length);
            /** Get all files */
            const files = await act(result.current.getFiles);
            expect(files.length).toBe($files.state.length);
        });
        /** [getItem] */
        it.each<{ type: DirectoryItemType; expected: DirectoryItem }>([
            { type: "folder", expected: $folders.one.state },
            { type: "file", expected: $files.one.state },
        ])(
            "[getItem:$type] should select existed item by ID: $expected.itemId",
            async ({ expected }) => {
                const item = await act(() =>
                    result.current.getItem(expected.itemId)
                );
                expect(item).toEqual(expected);
            }
        );
        /** [getPath] */
        it.each([
            {
                type: "folder",
                itemId: "components",
                expected: [
                    ["root", "components"],
                    ["root", "components"],
                ],
            },
            {
                type: "file",
                itemId: "components-1",
                expected: [
                    ["root", "components", "App.tsx"],
                    ["root", "components", "components-1"],
                ],
            },
        ])(
            "[getPath:$type] should return path of item $itemId correctly",
            async ({ itemId, expected }) => {
                const path = await act(() => result.current.getPath(itemId));
                expect(path).toEqual(expected);
            }
        );
        /** [getFirstLayerChildren] */
        it("[getFirstLayerChildren] should return its children correctly", async () => {
            const children = await act(() =>
                result.current.getFirstLayerChildren("components")
            );
            expect(children).toEqual($files.state);
        });
        /** [getAllChildren] */
        it.each([
            {
                type: "folder",
                itemId: "root",
                expected: {
                    folderIds: ["assets", "components", "pages"],
                    fileIds: ["components-1", "components-2"],
                },
            },
            {
                type: "folder",
                itemId: "components",
                expected: {
                    folderIds: ["components"],
                    fileIds: ["components-1", "components-2"],
                },
            },
            {
                type: "folder",
                itemId: "pages",
                expected: {
                    folderIds: ["pages"],
                    fileIds: [],
                },
            },
            {
                type: "file",
                itemId: "components-1",
                expected: { folderIds: [], fileIds: ["components-1"] },
            },
        ])(
            "[getAllChildren:$type] should return all children IDs of $itemId",
            async ({ itemId, expected }) => {
                const children = await act(() =>
                    result.current.getAllChildren(itemId)
                );
                expect(children).toEqual(expected);
            }
        );
    });
    /** [select] */
    it.each([
        {
            type: "folder",
            itemId: "root",
            expected: {
                item: { isFolder: true, name: "root", id: "root" },
                path: { name: [], id: [] },
            },
        },
        {
            type: "folder",
            itemId: "pages",
            expected: {
                item: { isFolder: true, name: "pages", id: "pages" },
                path: { name: ["root"], id: ["root"] },
            },
        },
        {
            type: "file",
            itemId: "components-1",
            expected: {
                item: {
                    isFolder: false,
                    name: "App.tsx",
                    id: "components-1",
                },
                path: {
                    name: ["root", "components"],
                    id: ["root", "components"],
                },
            },
        },
    ])(
        "[select:$type] should fetch correct item of $itemId",
        async ({ itemId, expected }) => {
            const { result } = renderHookWithProviders(useDirectory, options);

            /** Load all directory items */
            await act(() => result.current.reload($user.user.uid, $projectId));
            /** Select an item */
            const item = await act(() => result.current.select(itemId));
            expect(item).toEqual(expected);
            expect(result.current.currentItem).toEqual(item);
        }
    );
    /** [isCurrentItem] */
    it.each([
        { itemId: "pages", expected: true },
        { itemId: "root", expected: false },
    ])(
        "[isCurrentItem] item $itemId is the current item: $expected",
        async ({ itemId, expected }) => {
            const { result } = renderHookWithProviders(useDirectory, options);

            /** Load all directory items */
            await act(() => result.current.reload($user.user.uid, $projectId));
            /** Select an item */
            await act(() => result.current.select("pages"));
            /** Check if itemId is `currentItem` */
            const isItem = await act(() =>
                result.current.isCurrentItem(itemId)
            );
            expect(isItem).toBe(expected);
        }
    );
    /** [updateAction] */
    it.each<{ type: keyof DirectoryAction; action: DirectoryAction }>([
        { type: "rename", action: { rename: { itemId: "FAKE-ID" } } },
        {
            type: "copy",
            action: {
                copy: {
                    rootId: "FAKE-ID",
                    items: { folderIds: [], fileIds: ["FAKE-ID"] },
                },
            },
        },
    ])(
        "[updateAction:$type] should dispatch action with correct payload",
        async ({ action }) => {
            const { result } = renderHookWithProviders(useDirectory, options);
            /** Load all directory items */
            await act(() => result.current.reload($user.user.uid, $projectId));
            /** Update an action */
            await act(() => result.current.updateAction(action));
            expect(result.current.action).toEqual(action);
        }
    );
    /** [create] */
    it.each<{
        parent: string;
        type: "folder" | "file" | "upload";
        name: string;
        file?: UploadFile;
    }>([
        { parent: "root", type: "folder", name: "new-folder", file: undefined },
        { parent: "root", type: "file", name: "new-file.txt", file: undefined },
        {
            parent: "root",
            type: "upload",
            name: "new-file.txt",
            file: getDefaultFile("new-file.txt"),
        },
    ])(
        "[create:$type] should create $name under $parent",
        async ({ parent, type, name, file }) => {
            const { result } = renderHookWithProviders(useDirectory, options);
            /** Load all directory items */
            await act(() => result.current.reload($user.user.uid, $projectId));
            expect(result.current.directory.length).toBe(5);
            /** Select item `parent` */
            await act(() => result.current.select(parent));
            /** Create an item under `parent` */
            mockCreate(parent, type, name);
            await act(() => result.current.create(type, name, file));
            expect(result.current.directory.length).toBe(6);
        }
    );
    /** [rename] */
    it.each<{ type: DirectoryItemType; item: DirectoryItem }>([
        { type: "folder", item: $folders.one.state },
        { type: "file", item: $files.one.state },
    ])(
        "[rename:$type] should rename $item.name with a suffix `-RENAME`",
        async ({ type, item }) => {
            const { result } = renderHookWithProviders(useDirectory, options);
            /** Load all directory items */
            await act(() => result.current.reload($user.user.uid, $projectId));
            /** Rename an item */
            const { itemId, name } = item;
            const newName = `${name}-RENAME`;
            const newItem = mockRename(type, item, newName);
            await act(() => result.current.rename(type, itemId, newName));
            /** Get the renamed item and verify */
            const renamedItem = await act(() => result.current.getItem(itemId));
            expect(renamedItem).toEqual(newItem);
            /** Check directory action */
            expect(result.current.action.rename).toBeNull();
        }
    );
    /** [remove] */
    it.each([
        {
            type: "folder",
            itemId: "root",
            folderIds: ["assets", "components", "pages"],
            fileIds: ["components-1", "components-2"],
            refIds: [
                "Sample React-test-project-id/components/App.tsx",
                "Sample React-test-project-id/components/Routes.tsx",
            ],
            afterDelete: 0,
        },
        {
            type: "folder",
            itemId: "pages",
            folderIds: ["pages"],
            fileIds: [],
            refIds: [],
            afterDelete: 4,
        },
        {
            type: "file",
            itemId: "components-1",
            folderIds: [],
            fileIds: ["components-1"],
            refIds: [`Sample React-${$projectId}/components/App.tsx`],
            afterDelete: 4,
        },
    ])(
        "[remove:$type] should delete item $itemId and its children, with $afterDelete remaining items",
        async ({ itemId, folderIds, fileIds, refIds, afterDelete }) => {
            const { result } = renderHookWithProviders(useDirectory, options);
            /** Load all directory items */
            await act(() => result.current.reload($user.user.uid, $projectId));
            /** Delete by `itemId` */
            await act(() => result.current.remove(itemId));
            expect(foldersDB.delete).toHaveBeenCalledWith(folderIds);
            expect(filesDB.delete).toHaveBeenCalledWith(fileIds);
            expect(storageDB.delete).toHaveBeenCalledWith(refIds);
            expect(result.current.directory.length).toBe(afterDelete);
        }
    );
    /** [copy] */
    it.each([
        {
            type: "folder",
            itemId: "components",
            expected: {
                rootId: "components",
                items: {
                    folderIds: ["components"],
                    fileIds: ["components-1", "components-2"],
                },
            },
        },
        {
            type: "file",
            itemId: "components-1",
            expected: {
                rootId: "components-1",
                items: {
                    folderIds: [],
                    fileIds: ["components-1"],
                },
            },
        },
    ])(
        "[copy:$type] should copy item $itemId correctly",
        async ({ itemId, expected }) => {
            const { result } = renderHookWithProviders(useDirectory, options);
            /** Load all directory items */
            await act(() => result.current.reload($user.user.uid, $projectId));
            /** Copy an item */
            await act(() => result.current.copy(itemId));
            expect(result.current.action.copy).toEqual(expected);
        }
    );
    /** [bundleFiles] */
    it("[bundleFiles] should correctly bundle all files in the current project", async () => {
        const { result } = renderHookWithProviders(useDirectory, options);
        /** Load all directory items */
        await act(() => result.current.reload($user.user.uid, $projectId));
        /** Bundle files */
        const bundledFiles = await act(result.current.bundleFiles);
        expect(bundledFiles).toEqual($bundledFiles);
    });
});
