import type {
  PersistedPublishableSiteRecord,
  PublishableSiteRecord,
  PublishSiteRepositoryPort,
} from "@/contract/publish/ports";
import { sitesStorage } from "@/lib/sitesStorage";

export class SitesStoragePublishRepository implements PublishSiteRepositoryPort {
  public async getById(siteId: string): Promise<PublishableSiteRecord | undefined> {
    const site = await sitesStorage.get(siteId);
    return site as PublishableSiteRecord | undefined;
  }

  public async save(siteId: string, data: PersistedPublishableSiteRecord): Promise<void> {
    await sitesStorage.set(siteId, data as any);
  }
}

