import Link from "next/link";
import LoginForm from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const nextPath =
    next && next.startsWith("/") ? next : "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Entrar</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Enviamos um link mágico para o seu e-mail — sem senha.
        </p>
        <LoginForm
          error={error ?? null}
          next={nextPath}
        />
        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/" className="font-medium text-indigo-600 hover:underline">
            Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  );
}
