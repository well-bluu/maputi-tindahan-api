"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const TABS = [
	{href: "/", label: "Home"},
	{href: "/customers", label: "Customers"},
];

function isActive(pathname: string, href: string) {
	return href === "/"
		? pathname === "/"
		: pathname === href || pathname.startsWith(`${href}/`);
}

export function NavTabs() {
	const pathname = usePathname();
	return (
		<nav aria-label="Main" className="flex gap-8">
			{TABS.map((tab) => {
				const active = isActive(pathname, tab.href);
				return (
					<Link
						key={tab.href}
						href={tab.href}
						aria-current={active ? "page" : undefined}
						className={`-mb-px border-b-2 py-4 ${
							active
								? "border-neutral-900 font-semibold text-neutral-900"
								: "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
						}`}>
						{tab.label}
					</Link>
				);
			})}
		</nav>
	);
}
