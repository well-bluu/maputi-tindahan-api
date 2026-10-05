"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {db} from "@/db";
import {customers} from "@/db/schema";
import {getProfile} from "@/lib/auth";
import {addEntry, readCustomer} from "@/lib/customers";
import {CustomerSchema, EntrySchema} from "@/lib/definitions";
import {createClient} from "@/lib/supabase/server";

export type PostState = {message: string; name: string; balance: string};

export async function addCustomer(
	_prev: PostState,
	form: FormData,
): Promise<PostState> {
	const typed = {
		name: String(form.get("name") ?? ""),
		balance: String(form.get("balance") ?? ""),
	};

	const profile = await getProfile();
	if (!profile) redirect("/login");
	if (profile.role !== "admin")
		return {message: "Only the admin can add customers.", ...typed};

	const parsed = CustomerSchema.safeParse(typed);
	if (!parsed.success)
		return {message: parsed.error.issues[0].message, ...typed};

	try {
		await db.insert(customers).values(parsed.data);
	} catch {
		return {message: "Something went wrong.", ...typed};
	}

	revalidatePath("/customers");
	return {message: "", name: "", balance: ""};
}

export type EntryState = {message: string; amount: string};

export async function recordEntry(
	customerId: string,
	_prev: EntryState,
	form: FormData,
): Promise<EntryState> {
	const amount = String(form.get("amount") ?? "");

	const profile = await getProfile();
	if (!profile) redirect("/login");
	if (profile.role !== "admin")
		return {message: "Only the admin can add dues and payments.", amount};

	const parsed = EntrySchema.safeParse({kind: form.get("kind"), amount});
	if (!parsed.success) return {message: parsed.error.issues[0].message, amount};

	const customer = await readCustomer(customerId);
	if (!customer) return {message: "This customer was removed.", amount};
	if (parsed.data.kind === "payment" && parsed.data.amount > customer.balance) {
		return {
			message: `The payment is more than the ₱ ${customer.balance.toFixed(2)} owed.`,
			amount,
		};
	}

	try {
		await addEntry(customerId, parsed.data.kind, parsed.data.amount);
	} catch {
		return {message: "Something went wrong.", amount};
	}

	revalidatePath("/customers");
	return {message: "", amount: ""};
}

export async function signOut() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect("/login");
}
