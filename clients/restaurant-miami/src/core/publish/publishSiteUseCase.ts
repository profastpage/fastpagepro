import type {
  PublishSiteInputDto,
  PublishSiteOutputDto,
} from "@/contract/publish/dtos";
import type { PublishSiteUseCase } from "@/contract/publish/useCases";
import type {
  HtmlMetricsInjectorPort,
  PersistedPublishableSiteRecord,
  PublishSiteRepositoryPort,
} from "@/contract/publish/ports";
import { PublishInputValidationError } from "./errors";

export class PublishSiteCoreUseCase implements PublishSiteUseCase {
  constructor(
    private readonly repository: PublishSiteRepositoryPort,
    private readonly metricsInjector: HtmlMetricsInjectorPort,
  ) {}

  public async execute(input: PublishSiteInputDto): Promise<PublishSiteOutputDto> {
    const siteId = input?.siteId;
    const html = input?.html;

    if (!siteId || !html) {
      throw new PublishInputValidationError("Faltan datos requeridos (siteId, html)");
    }

    const validationIssues = this.collectValidationIssues(html);
    let optimizedHtml = this.optimizeHtml(html);
    optimizedHtml = this.metricsInjector.inject(optimizedHtml, siteId);

    const finalBundle = this.buildFinalBundle(optimizedHtml);
    const siteData = await this.repository.getById(siteId);

    if (siteData) {
      const updatedSite: PersistedPublishableSiteRecord = {
        ...siteData,
        html: optimizedHtml,
        status: "published",
        publishedAt: Date.now(),
        bundle: finalBundle,
      };
      await this.repository.save(siteId, updatedSite);
    }

    return {
      success: true,
      message: "Sitio optimizado y publicado con est\u00E1ndares PRO",
      validationIssues,
      optimizedHtml,
      publishedUrl: `/preview/${siteId}`,
      stats: {
        originalSize: html.length,
        optimizedSize: optimizedHtml.length,
        reduction: `${Math.round((1 - optimizedHtml.length / html.length) * 100)}%`,
      },
    };
  }

  private collectValidationIssues(html: string): string[] {
    const validationIssues: string[] = [];

    if (!html.includes("<title>")) {
      validationIssues.push("El sitio no tiene un t\u00EDtulo definido (<title>).");
    }

    if (!html.includes('name="description"')) {
      validationIssues.push("Falta la meta-etiqueta 'description' para SEO.");
    }

    const imgCount = (html.match(/<img/g) || []).length;
    const altCount = (html.match(/alt=/g) || []).length;
    if (imgCount > altCount) {
      validationIssues.push(
        `${imgCount - altCount} im\u00E1genes no tienen etiqueta 'alt' para accesibilidad.`,
      );
    }

    const emptyLinks = (html.match(/href=["'](#|javascript:void\(0\)|)["']/g) || []).length;
    if (emptyLinks > 0) {
      validationIssues.push(`${emptyLinks} enlaces est\u00E1n vac\u00EDos o apuntan a '#'.`);
    }

    return validationIssues;
  }

  private optimizeHtml(html: string): string {
    let optimizedHtml = html;

    optimizedHtml = optimizedHtml.replace(/<style id="editor-styles">[\s\S]*?<\/style>/gi, "");
    optimizedHtml = optimizedHtml.replace(
      /class="[^"]*selected-element[^"]*"/gi,
      (match: string) => match.replace("selected-element", "").replace(/\s+/g, " ").trim(),
    );
    optimizedHtml = optimizedHtml.replace(/contenteditable="(true|false)"/gi, "");
    optimizedHtml = optimizedHtml.replace(/data-fp-[a-z-]+="[^"]*"/gi, "");

    optimizedHtml = optimizedHtml.replace(
      /<a\s+(?:[^>]*?\s+)?href="https?:\/\/(?!yourdomain\.com)[^"]+"(?![^>]*?rel=)/gi,
      (match: string) => `${match} rel="noopener noreferrer" target="_blank"`,
    );

    optimizedHtml = optimizedHtml.replace(
      /<img(?![^>]*?loading=)(?![^>]*?decoding=)/gi,
      (match: string) => `${match} loading="lazy" decoding="async"`,
    );

    if (!optimizedHtml.includes("<meta charset")) {
      optimizedHtml = optimizedHtml.replace("<head>", '<head>\n    <meta charset="UTF-8">');
    }
    if (!optimizedHtml.includes('name="viewport"')) {
      optimizedHtml = optimizedHtml.replace(
        "<head>",
        '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      );
    }

    optimizedHtml = optimizedHtml
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\s\s+/g, " ")
      .replace(/>\s+</g, "><")
      .trim();

    return optimizedHtml;
  }

  private buildFinalBundle(optimizedHtml: string) {
    return {
      "index.html": optimizedHtml,
      "manifest.json": JSON.stringify(
        {
          short_name: "FastPage Site",
          name: "Published via FastPage 2.0",
          start_url: "/",
          display: "standalone",
          theme_color: "#06b6d4",
          background_color: "#09090b",
        },
        null,
        2,
      ),
      publishedAt: new Date().toISOString(),
    };
  }
}
