<script setup lang="ts">
import { computed, ref, watch } from "vue";

import tags from "@/data/tags.json";
import categories from "@/data/categories.json";

import AddFilterButton from "@/components/search/filters/AddFilterButton.vue";
import FilterCategoryRuleItem from "@/components/search/filters/category/FilterCategoryRuleItem.vue";
import FilterTagRuleItem from "@/components/search/filters/tag/FilterTagRuleItem.vue";
import filterIconUrl from "@/assets/icons/filter.svg";
import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";
import {
  FilterRuleTypes,
  cloneFilterState,
  createDefaultFilterState
} from "@/types/filterRule";
import type {
  FilterMatchMode,
  FilterRule,
  FilterRuleType,
  FilterState
} from "@/types/filterRule";

const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();

const matchMode = ref<FilterMatchMode>(createDefaultFilterState().matchMode);
const rules = ref<FilterRule[]>([]);
const usedRuleCount = computed(
  () => rules.value.filter(rule => rule.values.length !== 0).length
);
const allRuleTypes = Object.values(FilterRuleTypes) as FilterRuleType[];

const emit = defineEmits<{
  (event: "filter-state", payload: FilterState): void;
}>();

const tagOptions = computed(() => {
  const raw = (tags as any)?.tags;
  if (!Array.isArray(raw)) return [];
  return Array.from(new Set(raw.map((item: any) => String(item[0])))).sort(
    (a, b) => a.localeCompare(b)
  );
});

const categoryOptions = computed(() => {
  const raw = (categories as any)?.categories;
  if (!Array.isArray(raw)) return [];
  return Array.from(new Set(raw.map((item: any) => String(item[0])))).sort(
    (a, b) => a.localeCompare(b)
  );
});

const createRule = (type: FilterRuleType): FilterRule => ({
  id:
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type,
  operator: "eq",
  values: []
});

const handleAddRule = (type: FilterRuleType) => {
  if (!availableRuleTypes.value.includes(type)) {
    return;
  }
  rules.value = [...rules.value, createRule(type)];
};

const handleRuleChange = (updatedRule: FilterRule) => {
  rules.value = rules.value.map(rule =>
    rule.id === updatedRule.id
      ? { ...updatedRule, values: [...updatedRule.values] }
      : rule
  );
};

const handleRemoveRule = (ruleId: string) => {
  rules.value = rules.value.filter(rule => rule.id !== ruleId);
};

const handleReset = () => {
  const defaultState = createDefaultFilterState();
  matchMode.value = defaultState.matchMode;
  rules.value = [];
};

const availableRuleTypes = computed<FilterRuleType[]>(() => {
  const usedTypes = new Set(rules.value.map(rule => rule.type));
  return allRuleTypes.filter(type => !usedTypes.has(type));
});

watch(
  [matchMode, rules],
  () => {
    emit(
      "filter-state",
      cloneFilterState({
        matchMode: matchMode.value,
        rules: rules.value
      })
    );
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div ref="containerRef" class="drop-button-container">
    <button type="button" class="drop-button" @click="toggleDropdown">
      <img :src="filterIconUrl" class="button-icon" alt="" aria-hidden="true" />
      <span class="button-label" v-show="usedRuleCount !== 0">
        {{ usedRuleCount }}
      </span>
    </button>
    <div v-show="isOpen" class="dropdown-content">
      <div class="filter-content">
        <div class="filter-term">
          匹配
          <select v-model="matchMode">
            <option value="all">所有</option>
            <option value="some">任一</option>
          </select>
          过滤条件：
        </div>
        <div class="filter-rules">
          <template v-if="rules.length > 0">
            <template v-for="rule in rules" :key="rule.id">
              <filter-tag-rule-item
                v-if="rule.type === FilterRuleTypes.TAG"
                :rule="rule"
                :tags="tagOptions"
                @change="handleRuleChange"
                @remove="handleRemoveRule" />
              <filter-category-rule-item
                v-else-if="rule.type === FilterRuleTypes.CATEGORY"
                :rule="rule"
                :categories="categoryOptions"
                @change="handleRuleChange"
                @remove="handleRemoveRule" />
            </template>
          </template>
          <p v-else class="filter-empty">暂未添加过滤条件</p>
          <div>
            <add-filter-button
              :available-types="availableRuleTypes"
              @select="handleAddRule" />
          </div>
        </div>

        <div class="filter-bottom">
          <button type="button" class="reset-button" @click="handleReset">
            重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.button-label {
  margin-left: 3px;
  font-size: 1rem;
  color: #4a4a4a;
  white-space: nowrap;
}

.reset-button {
  width: 100%;
}

select {
  outline: none;
}

.button-icon {
  width: 1.1rem;
  height: 1.1rem;
  pointer-events: none;
  display: block;
}

.drop-button-container {
  position: relative;
  display: flex;
  height: 100%;
}

.drop-button {
  cursor: pointer;
  background: linear-gradient(rgb(255, 255, 255), rgb(238, 238, 238));
  background-repeat: repeat-x;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  padding: 0 0.4rem;
  font-weight: bolder;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
  font-size: 14px;
}

.drop-button:hover {
  background-color: #dddddd;
  background-image: linear-gradient(#ffffff, #dddddd);
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  /* 必须定死宽度，内层全是百分比 */
  /* 涉及到里面tag超出不显示的逻辑 */
  width: 400px;
  background-color: white;
  border: 1px solid silver;
  border-radius: 3px;
  white-space: nowrap;
  z-index: 1;
}

.filter-content {
  min-width: 25em;
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-term > select {
  font-size: 14px;
}

.filter-rules {
  display: flex;
  flex-direction: column;
}

.filter-empty {
  font-size: 0.85rem;
  color: #737373;
  margin-bottom: 0.5rem;
}

.filter-rule-container {
  line-height: 24px;
  --filter-rule-row-height: 1lh;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 8px;
  min-height: var(--filter-rule-row-height);
}

.description {
  min-width: 40px;
}

.filter-rule-container select {
  height: var(--filter-rule-row-height);
  line-height: var(--filter-rule-row-height);
  box-sizing: border-box;
}

.rule-term {
  flex: 1;
  min-width: 80px;
  max-width: min-content;
  font-size: 14px;
}

.rule {
  font-size: 14px;
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: stretch;
  --rule-row-height: var(--filter-rule-row-height);
}
</style>
