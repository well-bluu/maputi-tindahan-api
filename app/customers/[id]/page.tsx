import {notFound} from "next/navigation";
import {Breadcrumbs} from "@/app/ui/breadcrumbs";
import {readCustomer, readEntries} from "@/lib/customers";
import {verifyUser} from "@/lib/auth";
import {EntryForm} from "./entry-form";

export const dynamic = "force-dynamic";

type Props = {params: Promise<{id: string}>};

export default async function CustomerPage({params}: Props) {
	const profile = await verifyUser();
	const {id} = await params;
	const customer = await readCustomer(id);
	if (!customer) notFound();
	const entries = await readEntries(id);

	return (
		<main className="px-16 py-8">
			<Breadcrumbs
				items={[
					{label: "Home", href: "/"},
					{label: "Customers", href: "/customers"},
					{label: customer.name},
				]}
			/>
			<h1 className="mt-4 text-4xl font-bold">{customer.name}</h1>
			<p className="mt-6 text-3xl tabular-nums">
				₱ {customer.balance.toFixed(2)}
			</p>
			<p className="mt-2 text-neutral-500">Last paid {customer.lastPaid}</p>

			{profile.role === "admin" && <EntryForm customerId={customer.id} />}

			<h2 className="mt-10 text-2xl font-semibold">Dues and payments</h2>
			{entries.length === 0 ? (
				<p className="mt-4 text-neutral-500">Nothing recorded yet.</p>
			) : (
				<ul className="mt-4 max-w-2xl divide-y divide-neutral-200 border-y border-neutral-200">
					{entries.map((e) => (
						<li key={e.id} className="flex justify-between py-3">
							<span>
								{e.kind === "due" ? "Due" : "Payment"}
								<span className="ml-3 text-neutral-500">
									{e.createdAt.toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</span>
							</span>
							<span className="tabular-nums">
								{e.kind === "due" ? "+" : "−"} ₱ {e.amount.toFixed(2)}
							</span>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
