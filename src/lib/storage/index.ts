import { ProjectStorage } from "./projects";
import { FilesStorage } from "./files";
import { FoldersStorage } from "./folders";
import { FireStorage } from "./fireStore";

export const projectsDB = ProjectStorage.getStorage();
export const foldersDB = FoldersStorage.getStorage();
export const filesDB = FilesStorage.getStorage();
export const fireStoreDB = FireStorage.getStorage();
