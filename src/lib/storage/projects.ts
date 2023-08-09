import { Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Project } from "@/stores/project";
import { IStorage } from "./proto";

export class ProjectStorage extends IStorage<Project> {
    public static __instance: ProjectStorage;
    public collection = "projects";

    private constructor() {
        super();
    }

    public static getStorage(): ProjectStorage {
        return this.__instance ?? new ProjectStorage();
    }

    public unpack(doc: any): Project {
        const {
            name,
            template,
            tags,
            createdBy,
            lastModifiedAt: { seconds, nanoseconds },
        } = doc.data();
        return {
            projectId: doc.id,
            name,
            template,
            tags,
            createdBy,
            lastModifiedAt: new Timestamp(seconds, nanoseconds).toDate(),
        };
    }

    public async get(userId: string): Promise<Project[]> {
        try {
            const res = await db
                .collection(this.collection)
                .where("createdBy.uid", "==", userId)
                .get();
            return res.docs.map(this.unpack);
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}
