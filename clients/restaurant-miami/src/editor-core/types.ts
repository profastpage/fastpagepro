export type EditorProjectType = "builder" | "template" | "clone" | "store" | "menu";

export type EditorStatus =
  | "draft"
  | "published"
  | "dirty"
  | "saving"
  | "publishing";

export type EditorChangeKind = "text" | "image" | "bulk";

export type EditorAILevel = "none" | "basic" | "advanced";
export type EditorAnalyticsLevel = "none" | "basic" | "pro";

export interface EditorState<TData = any> {
  projectId: string;
  projectType: EditorProjectType;
  status: EditorStatus;
  data: TData;
  previewData: TData;
  lastSavedAt?: number;
  lastChangedAt?: number;
  lastChangeKind?: EditorChangeKind;
  lastError?: string | null;
}

export interface EditorUsageSnapshot {
  activeProjects: number;
  maxProjects: number | null;
  productsInProject: number;
  maxProductsPerProject: number | null;
  projectUsagePercent: number;
  productUsagePercent: number;
}

export interface PlanPermissionSnapshot {
  canonicalPlan: "starter" | "business" | "pro" | "agency";
  canRemoveBranding: boolean;
  canUseCustomDomain: boolean;
  canUseCloner: boolean;
  aiLevel: EditorAILevel;
  analyticsLevel: EditorAnalyticsLevel;
  maxProjects: number | null;
  maxProductsPerProject: number | null;
}
