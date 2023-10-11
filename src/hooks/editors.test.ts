import storage from "firebase/storage";
import { act } from "react-dom/test-utils";

import {
    $editorSelectedState,
    $files,
    $noEditorsSelectedState,
    $projectEditState,
    $projectId,
} from "#/mock";
import { renderHookWithProviders } from "#/utils";
import { sampleCode } from "@/data";
import { updateText } from "@/stores/editor";
import { useEditors } from "./editors";
import { RootState } from "./stores";

describe(useEditors, () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    /** [initial] */
    it("[initial] should returns an initial state", () => {
        const { result, store } = renderHookWithProviders(useEditors, {
            preloadedState: $projectEditState,
        });
        const { project, directory }: RootState = store.getState();
        /** Verify preloaded state */
        expect(project.currentProject.id).toBe($projectId);
        expect(directory.ids.length).toBe(5);
        /** Check initial state */
        expect(result.current.editors).toEqual([]);
        expect(result.current.currentEditor).toBe(null);
        expect(result.current.currentText).toBe("");
    });
    /** [getInfo] */
    it("[getInfo] should return correct editor by ID", async () => {
        const { result } = renderHookWithProviders(useEditors, {
            preloadedState: $noEditorsSelectedState,
        });
        /** Get editor by Id */
        const { itemId, content, name, extension } = $files.one.state;
        const editor = await act(() => result.current.getInfo(itemId));
        expect(editor).toEqual({ id: itemId, content, name, extension });
    });
    /** [updateText] */
    it.each([{ editorId: $files.one.state.itemId, content: "MODIFIED" }])(
        "[updateText] should modify text in editor $editorId to $content",
        async ({ editorId, content }) => {
            const { result } = renderHookWithProviders(useEditors, {
                preloadedState: $projectEditState,
            });
            await act(() => {
                /** Select an editor */
                result.current.select(editorId);
                /** Update text in editor */
                result.current.updateText(content);
            });
            expect(result.current.currentText).toEqual(content);
            const editor = result.current.getInfo(editorId);
            expect(editor.content).not.toEqual(content);
        }
    );
    /** [select] */
    it.each([
        {
            type: "null",
            preloaded: $projectEditState,
            prevEditor: null,
            prevText: "",
            editorId: $files.one.state.itemId,
            expectedText: "",
        },
        {
            type: "no-selected",
            preloaded: $noEditorsSelectedState,
            prevEditor: null,
            prevText: "",
            editorId: $files.one.state.itemId,
            expectedText: sampleCode,
        },
        {
            type: "selected",
            preloaded: $editorSelectedState,
            prevEditor: "components-2",
            prevText: "console.log(`hello world!`)",
            editorId: $files.one.state.itemId,
            expectedText: sampleCode,
        },
    ])(
        "[select:$type] should update `currentText` to previous editor $prevEditor, then set `currentEditor` to $editorId",
        async ({ preloaded, prevEditor, prevText, editorId, expectedText }) => {
            const { result } = renderHookWithProviders(useEditors, {
                preloadedState: preloaded,
            });
            /** Verify previous `currentEditor` & `currentText` */
            expect(result.current.currentEditor).toBe(prevEditor);
            expect(result.current.currentText).toEqual(prevText);
            /** Select an editor */
            await act(() => result.current.select(editorId));
            /** Verify new `currentEditor` & `currentText` */
            expect(result.current.currentEditor).toBe(editorId);
            expect(result.current.currentText).toEqual(expectedText);
        }
    );
    /** [open] */
    it.each([
        {
            type: "null",
            editorId: $files.one.state.itemId,
            autoSelect: false,
            expectedEditor: null,
            expectedText: "",
        },
        {
            type: "null",
            editorId: $files.one.state.itemId,
            autoSelect: true,
            expectedEditor: $files.one.state.itemId,
            expectedText: sampleCode,
        },
    ])(
        "[open:$type] should open the editor $editorId correctly",
        async ({ editorId, autoSelect, expectedEditor, expectedText }) => {
            const { result } = renderHookWithProviders(useEditors, {
                preloadedState: $projectEditState,
            });
            /** Open an editor */
            await act(() => result.current.open(editorId, autoSelect));
            expect(result.current.currentEditor).toBe(expectedEditor);
            expect(result.current.currentText).toEqual(expectedText);
        }
    );
    /** [close] */
    it.each([
        {
            type: "no-selected",
            preloadedState: $projectEditState,
            editorIds: ["components-2"],
            newEditor: null,
        },
        {
            type: "selected",
            preloadedState: $editorSelectedState,
            editorIds: ["components-2"],
            newEditor: "components-1",
        },
    ])(
        "[close:$type] should closed editors properly, then set `currentEditor` to $newEditor",
        async ({ preloadedState, editorIds, newEditor }) => {
            const { result } = renderHookWithProviders(useEditors, {
                preloadedState,
            });
            /** Close editors */
            await act(() => result.current.close(editorIds));
            expect(result.current.editorIds).not.toContain(editorIds);
            expect(result.current.currentEditor).toBe(newEditor);
        }
    );
    /** @todo [isModified] */
    it.each([
        { editorId: "components-1", doUpdate: true, expected: true },
        { editorId: "components-2", doUpdate: false, expected: false },
    ])(
        "[isModified] should check correctly if editor $editorId is modified: $expected",
        async ({ editorId, doUpdate, expected }) => {
            const { result } = renderHookWithProviders(useEditors, {
                preloadedState: $editorSelectedState,
            });
            const isModified = await act(() => {
                /** Select the editor */
                result.current.select(editorId);
                /** Modify the text in editor (optionally) */
                if (doUpdate) result.current.updateText("MODIFIED");
                return result.current.isModified(editorId);
            });
            /** @todo To be fixed */
            // expect(isModified).toBe(expected);
        }
    );
    /** [save] */
    it.each([
        {
            type: "selected",
            preloadedState: $editorSelectedState,
            editorId: "components-2",
            modifiedText: "MODIFIED",
        },
    ])(
        "[save:$type] should save the latest content of editor $editorId to be $modifiedText",
        async ({ preloadedState, editorId, modifiedText }) => {
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
                storageDB: { updateContent: vi.fn() },
                filesDB: { update: vi.fn() },
            }));
            const { result, store } = renderHookWithProviders(useEditors, {
                preloadedState,
            });
            await act(() => {
                /** Update text */
                store.dispatch(updateText(modifiedText));
                /** Save  */
                result.current.save(editorId);
            });
            expect(result.current.currentEditor).toBe(editorId);
            expect(result.current.currentText).toBe(modifiedText);
        }
    );
});
