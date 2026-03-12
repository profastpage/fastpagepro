import type { PublishSiteInputDto, PublishSiteOutputDto } from "./dtos";

export interface PublishSiteUseCase {
  execute(input: PublishSiteInputDto): Promise<PublishSiteOutputDto>;
}

