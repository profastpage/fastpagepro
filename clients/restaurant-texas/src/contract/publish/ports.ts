export type SiteType = "Clonador" | "Constructor" | "Plantilla";
export type SiteStatus = "draft" | "published" | "archived";

export interface PublishableSiteRecord {
  id: string;
  html: string;
  url: string;
  userId?: string;
  name?: string;
  type?: SiteType;
  createdAt: number;
  updatedAt?: number;
  published: boolean;
  publishedAt?: number;
  status?: SiteStatus;
  bundle?: unknown;
}

export type PersistedPublishableSiteRecord = Omit<PublishableSiteRecord, "id">;

export interface PublishSiteRepositoryPort {
  getById(siteId: string): Promise<PublishableSiteRecord | undefined>;
  save(siteId: string, data: PersistedPublishableSiteRecord): Promise<void>;
}

export interface HtmlMetricsInjectorPort {
  inject(html: string, siteId: string): string;
}

