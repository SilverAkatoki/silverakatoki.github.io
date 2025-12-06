<script setup lang="ts">
import { ref, watch } from "vue";

import tagIconUrl from "@/assets/icons/tag.svg";
import TagMultiSelect from "@/components/search/filters/tag/TagMultiSelect.vue";

import type { FilterRule, FilterRuleOperator } from "@/types/filterRule";

const props = defineProps<{
  tags: string[];
  rule: FilterRule;
}>();

const selectedOperator = ref<FilterRuleOperator>(props.rule.operator);
const selectedItems = ref<string[]>([...props.rule.values]);

const arraysAreEqual = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const emit = defineEmits<{
  change: [rule: FilterRule];
  remove: [ruleId: string];
}>();

watch(
  () => props.rule.operator,
  operator => {
    selectedOperator.value = operator;
  }
);
watch(
  () => props.rule.values,
  values => {
    selectedItems.value = [...values];
  },
  { deep: true }
);

watch([selectedOperator, selectedItems], () => {
  const normalizedValues = [...selectedItems.value];
  const hasOperatorChanged = selectedOperator.value !== props.rule.operator;
  const hasValuesChanged = !arraysAreEqual(normalizedValues, props.rule.values);

  if (!hasOperatorChanged && !hasValuesChanged) {
    return;
  }

  emit("change", {
    ...props.rule,
    operator: selectedOperator.value,
    values: normalizedValues
  });
});

const handleSelectedItems = (value: string[]) => {
  selectedItems.value = value;
};
</script>

<template>
  <div class="filter-rule-container">
    <img :src="tagIconUrl" class="icon" alt="" />
    <span class="description">标签</span>
    <select v-model="selectedOperator" class="rule-term">
      <option value="eq">等于</option>
      <option value="ne">不等于</option>
    </select>
    <div class="rule">
      <tag-multi-select
        :options="tags"
        :model-value="selectedItems"
        @selected="handleSelectedItems" />
    </div>
    <button
      type="button"
      class="remove-rule-btn"
      @click.stop="emit('remove', rule.id)">
—
</button>
  </div>
</template>

<style lang="css" scoped>
.icon {
  width: 1.1rem;
  pointer-events: none;
  display: block;
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
