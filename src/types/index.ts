import {
    SandpackPredefinedTemplate,
    SandpackFiles,
} from "@codesandbox/sandpack-react";

export * from "./directory";
export * from "./project";
export * from "./states";

export type UploadFile = globalThis.File;
export type BundledFiles = SandpackFiles;
export type PredefinedTemplate = SandpackPredefinedTemplate;
