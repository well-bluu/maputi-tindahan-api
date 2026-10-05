import Link from "next/link";
import {Breadcrumbs} from "@/app/ui/breadcrumbs";
import {verifyUser} from "@/lib/auth";
import {readCustomers} from "@/lib/customers";
import {signOut} from "./actions";
import {NewCustomerForm} from "./new-customer-form";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
	const profile = await verifyUser();
	const customers = await readCustomers();

	return (
		<main className="px-16 py-8">
			<Breadcrumbs items={[{label: "Home", href: "/"}, {label: "Customers"}]} />
			<div className="mt-4 flex items-baseline justify-between">
				<h1 className="text-4xl font-bold">Customers</h1>
				<form action={signOut}>
					<span className="mr-4 text-neutral-500">
						{profile.email} · {profile.role}
					</span>
					<button className="underline">Sign out</button>
				</form>
			</div>

			{profile.role === "admin" && <NewCustomerForm />}

			<ul className="mt-8 max-w-2xl divide-y divide-neutral-200 border-y border-neutral-200">
				{customers.map((c) => (
					<li key={c.id}>
						<Link
							href={`/customers/${c.id}`}
							className="flex justify-between py-3 hover:bg-neutral-50">
							<span className="text-xl">{c.name}</span>
							<span className="tabular-nums">₱ {c.balance.toFixed(2)}</span>
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
