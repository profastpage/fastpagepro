import type { HtmlMetricsInjectorPort } from "@/contract/publish/ports";
import { injectMetricsTracking } from "@/lib/metricsTracking";

export class MetricsTrackingInjector implements HtmlMetricsInjectorPort {
  public inject(html: string, siteId: string): string {
    return injectMetricsTracking(html, siteId);
  }
}

