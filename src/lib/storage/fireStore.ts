import {
    Query,
    doc,
    collection as getCollection,
    query,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    where,
    getDocs,
    DocumentData,
    DocumentSnapshot,
} from "firebase/firestore";
import { v4 } from "uuid";

import { db } from "@/config/firebase";

export interface BaseDBModel {
    createdAt: Date;
    updatedAt: Date;
}

export type UnpackFunction<T> = (doc: DocumentSnapshot) => T;

export async function get<T, DBModel extends DocumentData & BaseDBModel>(
    collection: string,
    unpack: UnpackFunction<T>,
    filter?: Partial<DBModel> | Record<string, string>
): Promise<T[]> {
    const results: T[] = [];
    try {
        let ref: Query = getCollection(db, collection);
        if (filter) {
            const contraints = Object.entries(filter).map(([k, v]) =>
                where(k, "==", v)
            );
            ref = query(ref, ...contraints);
        }
        const docs = await getDocs(ref);
        docs.forEach((doc) => results.push(unpack(doc)));
        // onSnapshot(ref, (snapshot: QuerySnapshot) => {
        //     snapshot.forEach((doc) => {
        //         results.push(unpack(doc));
        //     });
        // });
    } catch (error) {
        console.log(error);
    }
    return results;
}

export async function getById<T>(
    collection: string,
    id: string,
    unpack: UnpackFunction<T>
): Promise<T | undefined> {
    try {
        const ref = getCollection(db, collection, id);
        const data = await getDoc(doc(ref));
        return unpack(data);
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export async function create<T, DBModel extends DocumentData & BaseDBModel>(
    collection: string,
    data: Partial<DBModel>,
    unpack: UnpackFunction<T>
): Promise<T> {
    try {
        const _data = {
            ...data,
            id: v4(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const ref = getCollection(db, collection);
        await setDoc(doc(ref, _data.id), _data);
        const res = await getDoc(doc(ref, _data.id));
        return unpack(res);
    } catch (error) {
        console.log(error);
        return {} as T;
    }
}

export async function update<T, DBModel extends DocumentData & BaseDBModel>(
    collection: string,
    id: string,
    updateData: Partial<DBModel>,
    unpack: UnpackFunction<T>
): Promise<T> {
    try {
        const data = { ...updateData, updatedAt: new Date() };
        const ref = getCollection(db, collection);
        await updateDoc(doc(ref, id), data);
        const res = await getDoc(doc(ref, id));
        return unpack(res);
    } catch (error) {
        console.log(error);
        return {} as T;
    }
}

export async function del(collection: string, ids: string[]): Promise<void> {
    try {
        ids.forEach(async (id) => {
            const ref = getCollection(db, collection);
            await deleteDoc(doc(ref, id));
        });
    } catch (error) {
        console.log(error);
    }
}
