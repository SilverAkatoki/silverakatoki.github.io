export const FilterRuleTypes = {
  TAG: "tag",
  CATEGORY: "category"
} as const;

export type FilterRuleType =
  (typeof FilterRuleTypes)[keyof typeof FilterRuleTypes];

export type FilterRuleOperator = "eq" | "ne";
export type FilterMatchMode = "all" | "some";

export interface FilterRule {
  id: string;
  type: FilterRuleType;
  operator: FilterRuleOperator;
  values: string[];
}

export interface FilterState {
  matchMode: FilterMatchMode;
  rules: FilterRule[];
}

export const DEFAULT_FILTER_MATCH_MODE: FilterMatchMode = "all";

const createEmptyTagRule = (): FilterRule => ({
  id:
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `tag-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type: FilterRuleTypes.TAG,
  operator: "eq",
  values: []
});

export const DEFAULT_FILTER_STATE: FilterState = {
  matchMode: DEFAULT_FILTER_MATCH_MODE,
  rules: [createEmptyTagRule()]
};

export const createDefaultFilterState = (): FilterState => ({
 ...DEFAULT_FILTER_STATE
});

export const cloneFilterState = (state: FilterState): FilterState => ({
  matchMode: state.matchMode,
  rules: state.rules.map(rule => ({
    ...rule,
    values: [...rule.values]
  }))
});
