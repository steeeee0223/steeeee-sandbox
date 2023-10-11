import { renderHookWithProviders } from "../../test/utils";
import { useEditors } from "./editors";

describe(useEditors, () => {
    it("should returns an initial state", () => {
        const { result } = renderHookWithProviders(useEditors);
        const { currentEditor, currentText } = result.current;
        expect(currentEditor).toBe(null);
        expect(currentText).toBe("");
    });
});
