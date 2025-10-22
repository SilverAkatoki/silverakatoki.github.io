export const SortKeys = {
  DEFAULT: "default" as const,
  CREATED_DATE: "createdDate" as const,
  UPDATED_DATE: "updatedDate" as const
} as const;

export type SortDirection = "ASC" | "DESC";
export const DEFAULT_SORT_DIRECTION: SortDirection = "DESC";

export type SortProperty = (typeof SortKeys)[keyof typeof SortKeys];

export type SortRuleVariant = "default" | "directional";

export interface SortRule {
  key: SortProperty;
  label: string;
  variant: SortRuleVariant;
};

export type SortState = {
  sortProperty: SortProperty;
  sortDirection: SortDirection;
};

export const DEFAULT_SORT_STATE: SortState = {
  sortProperty: SortKeys.DEFAULT,
  sortDirection: DEFAULT_SORT_DIRECTION
};
