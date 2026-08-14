import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { siteUrl } from "@/lib/config";

function client() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    throw new Error("MP_ACCESS_TOKEN não configurada no .env");
  }
  return new MercadoPagoConfig({ accessToken: token });
}

export type CreatePreapprovalInput = {
  price: number;
  reason: string;
  externalReference: string;
  payerEmail: string;
};

export async function createPreapproval(input: CreatePreapprovalInput) {
  const preApproval = new PreApproval(client());
  return preApproval.create({
    body: {
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: input.price,
        currency_id: "BRL",
      },
      back_url: `${siteUrl}/dashboard`,
      external_reference: input.externalReference,
      payer_email: input.payerEmail,
      reason: input.reason,
    },
  });
}

export async function getPreapproval(id: string) {
  const preApproval = new PreApproval(client());
  return preApproval.get({ id });
}