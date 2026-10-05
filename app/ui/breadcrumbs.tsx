import Link from "next/link";

type Crumb = {label: string; href?: string};
type Props = {items: Crumb[]};

export function Breadcrumbs({items}: Props) {
	return (
		<nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
			<ol className="flex flex-wrap items-center gap-2">
				{items.map((item, i) => (
					<li key={item.href ?? item.label} className="flex items-center gap-2">
						{i > 0 && <span aria-hidden="true">/</span>}
						{item.href ? (
							<Link
								href={item.href}
								className="hover:text-neutral-900 hover:underline">
								{item.label}
							</Link>
						) : (
							<span aria-current="page" className="text-neutral-900">
								{item.label}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
