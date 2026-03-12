
export interface PerformanceResult {
  url: string;
  success: boolean;
  timeMs: number;
  originalSize: number;
  optimizedSize: number;
  reduction: string;
  error?: string;
  type: 'static' | 'dynamic' | 'complex';
}

export class PerformanceTester {
  private testUrls = [
    { url: 'https://example.com', type: 'static' as const },
    { url: 'https://nextjs.org', type: 'dynamic' as const },
    { url: 'https://tailwindcss.com', type: 'complex' as const },
    { url: 'https://github.com', type: 'complex' as const },
    { url: 'https://news.ycombinator.com', type: 'static' as const }
  ];

  async runTests(): Promise<PerformanceResult[]> {
    const results: PerformanceResult[] = [];

    for (const test of this.testUrls) {
      const start = Date.now();
      try {
        // We simulate the clone API call logic here
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/clone?url=${encodeURIComponent(test.url)}`);
        const timeMs = Date.now() - start;
        
        if (response.ok) {
          const html = await response.text();
          const originalSize = html.length; // Approximate, as it's already "sanitized" by our API
          
          results.push({
            url: test.url,
            success: true,
            timeMs,
            originalSize,
            optimizedSize: originalSize, // In this test, we look at the clone output
            reduction: '0%',
            type: test.type
          });
        } else {
          const errorData = await response.json();
          results.push({
            url: test.url,
            success: false,
            timeMs,
            originalSize: 0,
            optimizedSize: 0,
            reduction: '0%',
            error: errorData.error || 'Unknown error',
            type: test.type
          });
        }
      } catch (error: any) {
        results.push({
          url: test.url,
          success: false,
          timeMs: Date.now() - start,
          originalSize: 0,
          optimizedSize: 0,
          reduction: '0%',
          error: error.message,
          type: test.type
        });
      }
    }

    return results;
  }
}
