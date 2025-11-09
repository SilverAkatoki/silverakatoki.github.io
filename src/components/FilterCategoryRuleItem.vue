<script setup lang="ts">
import { ref, watch } from "vue";

import ruleIconUrl from "@/assets/icons/category.svg";
import RuleMultiSelect from "@/components/RuleMultiSelect.vue";
import type { FilterRule, FilterRuleOperator } from "@/types/filterRule";

const props = defineProps<{
  categories: string[];
  rule: FilterRule;
}>();

const selectedOperator = ref<FilterRuleOperator>(props.rule.operator);
const selectedItems = ref<string[]>([...props.rule.values]);

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
  emit("change", {
    ...props.rule,
    operator: selectedOperator.value,
    values: [...selectedItems.value]
  });
});

const handleSelectedItems = (value: string[]) => {
  selectedItems.value = value;
};
</script>

<template>
  <div class="filter-rule-container">
    <img :src="ruleIconUrl" class="icon" alt="" />
    <span class="description">类别</span>
    <select class="rule-operator" v-model="selectedOperator">
      <option value="eq">等于</option>
      <option value="ne">不等于</option>
    </select>
    <div class="rule">
      <rule-multi-select
        :options="categories"
        :model-value="selectedItems"
        @selected="handleSelectedItems"
      />
    </div>
    <button type="button" class="remove-rule-btn" @click="emit('remove', rule.id)">—</button>
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

.rule-operator {
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
