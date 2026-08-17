import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Apps IA | Devocional e Conteúdo com Inteligência Artificial",
  description:
    "Devocional diário personalizado no estilo Pr. Jailson Ferreira e gerador de conteúdo para redes sociais com Inteligência Artificial. Assinatura mensal, pague no Mercado Pago.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-zinc-900">{children}</body>
    </html>
  );
}
