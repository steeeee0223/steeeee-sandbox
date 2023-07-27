import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { loadLanguage, LanguageName } from "@uiw/codemirror-extensions-langs";

export const languages: Record<string, LanguageName> = {
    txt: "textile",
    json: "json",
    php: "php",
    py: "python",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    java: "java",
    html: "xml",
    xml: "xml",
    css: "css",
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
};

export function loadExtensions(fileExtension: string): Extension[] {
    const extensions: Extension[] = [EditorView.lineWrapping];
    const lang = loadLanguage(languages[fileExtension]);
    if (lang) {
        console.log(`[Panel] setting language to ${languages[fileExtension]}`);
        extensions.push(lang);
    }
    return extensions;
}
