import Link from "next/link";
import SignOutButton from "@/app/dashboard/sign-out-button";

export default function AppHeader({ title }: { title: string }) {
  return (
    <header className="border-b border-zinc-200">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            Mini Apps <span className="text-indigo-600">IA</span>
          </Link>
          <span className="text-sm text-zinc-500">{title}</span>
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
