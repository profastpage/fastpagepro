export interface PublishSiteInputDto {
  siteId: string;
  html: string;
}

export interface PublishSiteStatsDto {
  originalSize: number;
  optimizedSize: number;
  reduction: string;
}

export interface PublishSiteOutputDto {
  success: boolean;
  message: string;
  validationIssues: string[];
  optimizedHtml: string;
  publishedUrl: string;
  stats: PublishSiteStatsDto;
}

