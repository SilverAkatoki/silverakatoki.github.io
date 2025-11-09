<script setup lang="ts">
import { computed, watch } from "vue";

import categoryIconUrl from "@/assets/icons/category.svg";
import tagIconUrl from "@/assets/icons/tag.svg";
import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";
import { FilterRuleTypes, type FilterRuleType } from "@/types/filterRule";

const props = defineProps<{
  availableTypes?: FilterRuleType[];
}>();

const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();

const emit = defineEmits<{
  select: [ruleType: FilterRuleType];
}>();

const ruleOptions: Array<{
  type: FilterRuleType;
  label: string;
  icon: string;
}> = [
  { type: FilterRuleTypes.TAG, label: "标签", icon: tagIconUrl },
  { type: FilterRuleTypes.CATEGORY, label: "类别", icon: categoryIconUrl }
];

const filteredRuleOptions = computed(() => {
  if (!props.availableTypes) {
    return ruleOptions;
  }
  const allowList = new Set(props.availableTypes);
  return ruleOptions.filter(option => allowList.has(option.type));
});

const isDisabled = computed(() => filteredRuleOptions.value.length === 0);

watch(
  filteredRuleOptions,
  options => {
    if (options.length === 0 && isOpen.value) {
      toggleDropdown();
    }
  },
  { deep: true }
);

const handleToggle = () => {
  if (isDisabled.value) return;
  toggleDropdown();
};

const handleSelected = (ruleType: FilterRuleType, event?: MouseEvent) => {
  event?.stopPropagation();
  toggleDropdown();
  emit("select", ruleType);
};
</script>

<template>
  <div ref="containerRef" class="drop-button-container">
    <button
      type="button"
      class="add-rule-button"
      :disabled="isDisabled"
      @click="handleToggle">
      +
    </button>
    <div v-show="isOpen" class="dropdown-content">
      <span
        v-for="rule in filteredRuleOptions"
        :key="`rule-${rule.type}`"
        class="dropdown-item"
        @click="handleSelected(rule.type, $event)"
      >
        <img class="icon" :src="rule.icon" alt="" />
        {{ rule.label }}
      </span>
    </div>
  </div>
</template>

<style lang="css" scoped>
.icon {
  width: 1.1rem;
  height: 1.1rem;
  pointer-events: none;
  display: block;
}

.dropdown-item {
  user-select: none;
  color: black;
  text-decoration: none;
  display: block;
  margin: 3px 3px;
  border-radius: 3px;
  padding: 2px 0.4rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.add-rule-button {
  width: 1.1rem;
  height: 1.1rem;
}

.add-rule-button:disabled {
  opacity: 0.5;
}

.drop-button-container {
  position: relative;
  display: flex;
  height: 100%;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  /* 必须定死宽度，内层全是百分比 */
  /* 涉及到里面tag超出不显示的逻辑 */
  width: 35%;
  background-color: white;
  border: 1px solid silver;
  border-radius: 3px;
  white-space: nowrap;
  z-index: 1;
}
</style>
