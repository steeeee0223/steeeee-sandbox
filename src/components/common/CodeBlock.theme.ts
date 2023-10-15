import { CreateThemeOptions } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

export const myColor = {
    chalky: "#e5c07b",
    coral: "#ef596f",
    dark: "#5c6370",
    error: "#f44747",
    fountainBlue: "#56b6c2",
    green: "#98c379",
    invalid: "#ffffff",
    lightDark: "#7f848e",
    lightWhite: "#abb2bf",
    malibu: "#61afef",
    purple: "#c678dd",
    whiskey: "#d19a66",
    deepRed: "#be5046",
};

export const myTheme: CreateThemeOptions = {
    theme: "dark",
    settings: {
        background: "#272C35",
        foreground: "#9d9b97",
        caret: "#797977",
        selection: "#ffffff30",
        selectionMatch: "#2B323D",
        gutterBackground: "#272C35",
        gutterForeground: "#465063",
        gutterActiveForeground: "#fff",
        lineHighlight: "#ffffff0f",
        fontFamily:
            'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    },
    styles: [
        { tag: [t.keyword], color: myColor.purple },
        {
            tag: [t.number, t.bool, t.null, t.attributeName, t.brace, t.paren],
            color: myColor.whiskey,
        },
        {
            tag: [t.variableName, t.propertyName, t.standard(t.tagName)],
            color: myColor.coral,
        },
        { tag: [t.comment], color: myColor.lightDark },
        {
            tag: [t.operator, t.bracket, t.special(t.brace), t.escape],
            color: myColor.fountainBlue,
        },
        { tag: [t.string], color: myColor.green },
        {
            tag: [t.function(t.variableName), t.function(t.propertyName)],
            color: myColor.malibu,
        },
        {
            tag: [t.className, t.typeName, t.self, t.tagName],
            color: myColor.chalky,
        },
        { tag: [t.content, t.separator], color: myColor.lightWhite },
    ],
};
