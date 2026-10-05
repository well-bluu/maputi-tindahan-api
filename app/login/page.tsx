import {LoginForm} from "./login-form";

export default function LoginPage() {
	return (
		<main className="px-16 py-8">
			<h1 className="text-4xl font-bold">Sign in</h1>
			<p className="mt-2 text-neutral-500">
				New accounts are clients: they can see the customers. There is one
				admin, who can add them.
			</p>
			<LoginForm />
		</main>
	);
}
