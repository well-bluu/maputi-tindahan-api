import Link from "next/link";

export default function Home() {
	return (
		<main className="px-16 py-8">
			<h1 className="text-4xl font-bold">Tindahan ni Aling Nena</h1>
			<p className="mt-4 text-xl">
				Parang isang kwentong pampelikula Mura na at sari-sari pa ang itinitinda
			</p>
			<p className="mt-4 text-xl">
				Pero ang tanging nais ko ay 'di nabibili ng pera
			</p>
			<Link href="/customers" className="mt-6 inline-block underline">
				View customers
			</Link>
		</main>
	);
}
