import { db } from "@/config/firebase";

export abstract class IStorage<T> {
    public collection!: string;

    public abstract unpack(doc: any): T;

    public abstract get(params: any): Promise<T[]> | T[];

    public async create(data: any): Promise<T> {
        try {
            const res = await db
                .collection(this.collection)
                .add({ ...data, createdAt: new Date(), updatedAt: new Date() });
            const doc = await res.get();
            return this.unpack(doc);
        } catch (error) {
            throw new Error(
                `[${this.collection}] Error occurred while adding the doc into database`
            );
        }
    }

    public async update(itemId: string, data: any): Promise<T> {
        try {
            const updateData = { ...data, updatedAt: new Date() };
            await db.collection(this.collection).doc(itemId).update(updateData);
            const doc = await db.collection(this.collection).doc(itemId).get();
            return this.unpack(doc);
        } catch (error) {
            throw new Error(
                `[${this.collection}] Error occurred while updating the doc`
            );
        }
    }

    public async delete(ids: string[]) {
        for (const id of ids) {
            try {
                await db.collection(this.collection).doc(id).delete();
            } catch (error) {
                console.log(error);
            }
        }
    }
}
