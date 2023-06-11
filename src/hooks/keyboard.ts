import {
    KeyboardEventHandler,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
} from "react";

export interface Shortcuts {
    single?: string[];
    ctrl?: string[];
    meta?: string[];
    shift?: string[];
    alt?: string[];
}

export const useKeyPress = (
    keys: Shortcuts,
    onPress: KeyboardEventHandler,
    node: any = null
) => {
    // implement the callback ref pattern
    const onPressRef = useRef(onPress);
    useLayoutEffect(() => {
        onPressRef.current = onPress;
    });

    // handle what happens on key press
    const handleKeyPress = useCallback<KeyboardEventHandler>(
        (e) => {
            if (e.metaKey && keys.meta?.some((key) => e.key === key)) {
                e.preventDefault();
                console.log(`you pressed cmd + ${e.key}`);
                onPressRef.current(e);
            }
            if (e.ctrlKey && keys.ctrl?.some((key) => e.key === key)) {
                e.preventDefault();
                console.log(`you pressed ctrl + ${e.key}`);
                onPressRef.current(e);
            }
            if (e.altKey && keys.alt?.some((key) => e.key === key)) {
                e.preventDefault();
                console.log(`you pressed alt + ${e.key}`);
                onPressRef.current(e);
            }
            if (e.shiftKey && keys.shift?.some((key) => e.key === key)) {
                e.preventDefault();
                console.log(`you pressed shift + ${e.key}`);
                onPressRef.current(e);
            }
        },
        [keys]
    );

    useEffect(() => {
        // target is either the provided node or the document
        const targetNode = node ?? document;
        // attach the event listener
        targetNode && targetNode.addEventListener("keydown", handleKeyPress);

        // remove the event listener
        return () =>
            targetNode &&
            targetNode.removeEventListener("keydown", handleKeyPress);
    }, [handleKeyPress, node]);
};
