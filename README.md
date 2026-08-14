# Mini Apps IA

Plataforma com 2 mini apps de assinatura com Inteligência Artificial:

1. **Devocional Diário com IA** — devocional bíblico personalizado por dia.
2. **Gerador de Conteúdo com IA** — legendas, roteiros e e-mails para redes sociais.

Stack: Next.js 16 (App Router) + TypeScript + Tailwind, Supabase (auth + banco),
Mercado Pago (assinatura recorrente) e OpenRouter (IA).

## Configuração

1. Copie `.env.example` para `.env.local` e preencha as chaves:

| Variável | Onde pegar |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `OPENROUTER_API_KEY` | https://openrouter.ai → Keys |
| `MP_ACCESS_TOKEN` | Mercado Pago Developers → Credenciais |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` (dev) ou a URL do deploy |
| `PLAN_DEVOCIONAL_PRICE` / `PLAN_CONTEUDO_PRICE` | preços mensais em R$ |

2. Crie o banco no Supabase: **SQL Editor** → cole o conteúdo de `supabase/schema.sql` → Run.

3. No Supabase **Authentication → URL Configuration**, adicione
   `http://localhost:3000/auth/callback` (e a URL de produção) em
   **Redirect URLs**.

4. Rode:

```bash
npm install
npm run dev
```

## Webhook do Mercado Pago

No painel do Mercado Pago (painel de desenvolvedor), cadastre o webhook
apontando para `SUA_URL/api/webhooks/mercadopago` com o evento **preapproval**.
É ele que ativa a assinatura do usuário após o pagamento.

## Deploy (Vercel)

1. Suba o projeto para um repositório Git (GitHub/GitLab).
2. Importe no Vercel, adicione as mesmas variáveis de ambiente em **Settings → Environment Variables**.
3. Adicione a URL de produção (`https://SEU-DOMINIO/auth/callback`) nas Redirect URLs do Supabase.
4. Atualize o webhook do Mercado Pago com a URL de produção.

## Rotas principais

- `/` — página de vendas
- `/login` — login por link mágico (sem senha)
- `/dashboard` — assinaturas e acesso aos apps
- `/devocional` — mini app 1
- `/conteudo` — mini app 2
- `/assinar?plan=devocional|conteudo` — checkout
- `/api/webhooks/mercadopago` — webhook de assinatura
