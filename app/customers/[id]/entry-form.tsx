"use client";

import {useActionState} from "react";
import {recordEntry} from "../actions";

export function EntryForm({customerId}: {customerId: string}) {
	const [state, action, pending] = useActionState(
		recordEntry.bind(null, customerId),
		{
			message: "",
			amount: "",
		},
	);

	return (
		<form action={action} className="mt-8 flex flex-wrap items-start gap-4">
			<input
				name="amount"
				inputMode="decimal"
				defaultValue={state.amount}
				placeholder="Amount"
				required
				className="w-40 border px-4 py-2"
			/>
			<button
				name="kind"
				value="due"
				disabled={pending}
				className="border border-neutral-900 px-4 py-2 disabled:opacity-50">
				Add due
			</button>
			<button
				name="kind"
				value="payment"
				disabled={pending}
				className="bg-neutral-900 px-4 py-2 text-white disabled:opacity-50">
				Record payment
			</button>
			{state.message && <p className="w-full text-red-700">{state.message}</p>}
		</form>
	);
}
