import type { PublishSiteUseCase } from "@/contract/publish/useCases";
import { PublishSiteCoreUseCase } from "@/core/publish/publishSiteUseCase";
import { MetricsTrackingInjector } from "./MetricsTrackingInjector";
import { SitesStoragePublishRepository } from "./SitesStoragePublishRepository";

let publishSiteUseCaseInstance: PublishSiteUseCase | null = null;

export function buildPublishSiteUseCase(): PublishSiteUseCase {
  if (!publishSiteUseCaseInstance) {
    publishSiteUseCaseInstance = new PublishSiteCoreUseCase(
      new SitesStoragePublishRepository(),
      new MetricsTrackingInjector(),
    );
  }

  return publishSiteUseCaseInstance;
}

