<script setup lang="ts">
import { computed, ref, watch } from "vue";

import arrowDownArrowUpIconUrl from "@/assets/icons/arrow-down-arrow-up.svg";
import arrowDownShortWideIconUrl from "@/assets/icons/arrow-down-short-wide.svg";
import arrowDownWideShortIconUrl from "@/assets/icons/arrow-down-wide-short.svg";
import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";
import { SortKeys, DEFAULT_SORT_DIRECTION } from "@/types/sortRuleSelector";

import type {
  SortDirection,
  SortProperty,
  SortRule,
  SortState
} from "@/types/sortRuleSelector";

const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();

const sortRules: SortRule[] = [
  { key: SortKeys.DEFAULT, label: "默认排序", variant: "default" },
  { key: SortKeys.CREATED_DATE, label: "创建日期", variant: "directional" },
  { key: SortKeys.UPDATED_DATE, label: "修改日期", variant: "directional" }
];

const sortProperty = ref<SortProperty>(SortKeys.DEFAULT);

const sortDirection = ref<SortDirection>(DEFAULT_SORT_DIRECTION);

const selectedRule = computed(
  () => sortRules.find(rule => rule.key === sortProperty.value) ?? sortRules[0]
);
const isDefaultSort = computed(() => sortProperty.value === SortKeys.DEFAULT);

const emit = defineEmits(["sort-state"]);

watch([sortProperty, sortDirection], ([property, direction]) =>
  emit("sort-state", {
    sortProperty: property,
    sortDirection: direction
  } as SortState)
);

const handleSelectRule = (property: SortProperty) => {
  if (sortProperty.value !== property) {
    sortProperty.value = property;
    sortDirection.value = DEFAULT_SORT_DIRECTION;
  } else {
    sortDirection.value = sortDirection.value === "ASC" ? "DESC" : "ASC";
  }
};
</script>

<template>
  <div ref="containerRef" class="drop-button-container">
    <button type="button" class="drop-button" @click="toggleDropdown">
      <template v-if="isDefaultSort">
        <img
          :src="arrowDownArrowUpIconUrl"
          class="button-icon"
          alt=""
          aria-hidden="true"
        />
      </template>
      <template v-else>
        <img
          :src="
            sortDirection === 'ASC'
              ? arrowDownShortWideIconUrl
              : arrowDownWideShortIconUrl
          "
          class="button-icon"
          alt=""
          aria-hidden="true"
        />
        <span class="button-label">{{ selectedRule.label }}</span>
      </template>
    </button>
    <div v-show="isOpen" class="dropdown-content">
      <div
        v-for="rule in sortRules"
        :key="rule.key"
        class="dropdown-item"
        :class="{ selected: sortProperty === rule.key }"
        @click="handleSelectRule(rule.key)"
      >
        <span class="item-description">{{ rule.label }}</span>
        <div
          class="item-type"
          :class="[
            { active: sortProperty === rule.key },
            rule.variant === 'default' ? 'default' : null
          ]"
          aria-hidden="true"
        >
          <template v-if="rule.variant === 'default'">
            <span class="item-check">✓</span>
          </template>
          <template v-else>
            <img
              v-if="sortDirection === 'ASC'"
              :src="arrowDownShortWideIconUrl"
              class="item-icon"
              alt=""
              aria-hidden="true"
            />
            <img
              v-else
              :src="arrowDownWideShortIconUrl"
              class="item-icon"
              alt=""
              aria-hidden="true"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.button-icon {
  width: 1.1rem;
  height: 1.1rem;
  pointer-events: none;
  display: block;
}

.button-label {
  font-size: 0.85rem;
  color: #4a4a4a;
  white-space: nowrap;
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
  gap: 0.4rem;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 10em;
  background-color: white;
  border: 1px solid silver;
  border-radius: 3px;
  white-space: nowrap;
  z-index: 1;
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
  justify-content: space-between;
  align-items: center;
}

.dropdown-item.selected {
  background-color: #eee;
}

.dropdown-item > .item-description {
  font-size: small;
}

.dropdown-item > .item-type {
  width: 1.4rem;
  height: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  visibility: hidden;
}

.dropdown-item > .item-type.active {
  visibility: visible;
}

.dropdown-item > .item-type > .item-icon {
  width: 1.1rem;
  height: 1.1rem;
  pointer-events: none;
}

.dropdown-item > .item-type .item-check {
  font-size: 0.9rem;
  font-weight: bold;
  line-height: 1;
  color: #7a7a7a;
}
</style>
