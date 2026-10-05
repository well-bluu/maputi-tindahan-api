import "server-only";
import {asc, desc, eq, sql} from "drizzle-orm";
import {db} from "@/db";
import {customers, entries} from "@/db/schema";

export type Customer = typeof customers.$inferSelect;
export type Entry = typeof entries.$inferSelect;
export type EntryKind = "due" | "payment";

export async function readCustomers(): Promise<Customer[]> {
	return db.select().from(customers).orderBy(asc(customers.name));
}

export async function readCustomer(id: string): Promise<Customer | null> {
	const [row] = await db.select().from(customers).where(eq(customers.id, id));
	return row ?? null;
}

export async function readEntries(customerId: string): Promise<Entry[]> {
	return db
		.select()
		.from(entries)
		.where(eq(entries.customerId, customerId))
		.orderBy(desc(entries.createdAt));
}

export async function addEntry(
	customerId: string,
	kind: EntryKind,
	amount: number,
) {
	const change = kind === "due" ? amount : -amount;
	const today = new Date().toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
	return db.transaction(async (tx) => {
		const [entry] = await tx
			.insert(entries)
			.values({customerId, kind, amount})
			.returning();
		await tx
			.update(customers)
			.set({
				balance: sql`${customers.balance} + ${change}`,
				...(kind === "payment" ? {lastPaid: today} : {}),
			})
			.where(eq(customers.id, customerId));
		return entry;
	});
}
