import type {
  ThemeMarketplaceCheckoutSessionDto,
  ThemeMarketplacePaymentGatewayPort,
  ThemeMarketplacePaymentStatusDto,
} from "@/contract/themeMarketplace/ports";
import { createIzipayCheckoutSession, fetchIzipayPaymentStatus } from "@/lib/payments/izipay";

export class IzipayThemeMarketplacePaymentGateway implements ThemeMarketplacePaymentGatewayPort {
  public async createCheckoutSession(input: {
    referenceId: string;
    amountSoles: number;
    customerId: string;
    customerEmail: string;
    description: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string | number | boolean>;
  }): Promise<ThemeMarketplaceCheckoutSessionDto> {
    const session = await createIzipayCheckoutSession({
      referenceId: input.referenceId,
      amountSoles: input.amountSoles,
      customerId: input.customerId,
      customerEmail: input.customerEmail,
      description: input.description,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      intent: "THEME_PACK",
      metadata: input.metadata,
    });

    return {
      mode: session.mode,
      checkoutUrl: session.checkoutUrl,
      providerPaymentId: session.providerPaymentId,
    };
  }

  public async getPaymentStatus(input: { providerPaymentId: string }): Promise<ThemeMarketplacePaymentStatusDto> {
    const status = await fetchIzipayPaymentStatus({
      providerPaymentId: input.providerPaymentId,
    });

    return {
      status: status.status,
      paid: status.paid,
    };
  }
}
