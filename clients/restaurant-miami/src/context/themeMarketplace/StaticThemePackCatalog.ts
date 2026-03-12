import type { ThemePackDto } from "@/contract/themeMarketplace/dtos";
import type { ThemePackCatalogPort } from "@/contract/themeMarketplace/ports";
import { THEME_PACKS, getThemePackById } from "@/lib/themeMarketplace/packs";

function toPackDto(pack: ThemePackDto): ThemePackDto {
  return {
    ...pack,
    includedThemes: [...pack.includedThemes],
  };
}

export class StaticThemePackCatalog implements ThemePackCatalogPort {
  public list(): ThemePackDto[] {
    return THEME_PACKS.map((pack) => toPackDto(pack as ThemePackDto));
  }

  public findById(packId: string): ThemePackDto | null {
    const pack = getThemePackById(packId);
    if (!pack) return null;
    return toPackDto(pack as ThemePackDto);
  }
}
