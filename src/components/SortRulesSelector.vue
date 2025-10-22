<script setup lang="ts">
import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";
import { computed, ref, watch } from "vue";

const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();

const SortKeys = {
  DEFAULT: "default" as const,
  CREATED_DATE: "createdDate" as const,
  UPDATED_DATE: "updatedDate" as const
} as const;

type SortDirection = "ASC" | "DESC";
type SortProperty = (typeof SortKeys)[keyof typeof SortKeys];

type SortRuleVariant = "default" | "directional";

interface SortRule {
  key: SortProperty;
  label: string;
  variant: SortRuleVariant;
}

const sortRules: SortRule[] = [
  { key: SortKeys.DEFAULT, label: "默认排序", variant: "default" },
  { key: SortKeys.CREATED_DATE, label: "创建日期", variant: "directional" },
  { key: SortKeys.UPDATED_DATE, label: "修改日期", variant: "directional" }
];

const sortProperty = ref<SortProperty>(SortKeys.DEFAULT);

const DEFAULT_SORT_DIRECTION: SortDirection = "DESC" as const;
const sortDirection = ref<SortDirection>(DEFAULT_SORT_DIRECTION);

const selectedRule = computed(
  () => sortRules.find((rule) => rule.key === sortProperty.value) ?? sortRules[0]
);
const isDefaultSort = computed(() => sortProperty.value === SortKeys.DEFAULT);

const emit = defineEmits(["sort-state"]);

watch([sortProperty, sortDirection], ([property, direction]) =>
  emit("sort-state", { sortProperty: property, sortDirection: direction })
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
    <button type="button" class="drop-button" @click.stop="toggleDropdown">
      <template v-if="isDefaultSort">
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="far"
          data-icon="arrow-down-arrow-up"
          class="button-icon"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path
            d="M47 377l96 96c9.4 9.4 24.6 9.4 33.9 0l96-96c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55V56c0-13.3-10.7-24-24-24s-24 10.7-24 24V398.1L81 343c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9zM399 39l-96 96c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l55-55V456c0 13.3 10.7 24 24 24s24-10.7 24-24V113.9l55 55c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L433 39c-9.4-9.4-24.6-9.4-33.9 0z"
          ></path>
        </svg>
      </template>
      <template v-else>
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="far"
          :data-icon="sortDirection === 'ASC' ? 'arrow-down-short-wide' : 'arrow-down-wide-short'"
          class="button-icon"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path
            v-if="sortDirection === 'ASC'"
            d="M15 377l96 96c9.4 9.4 24.6 9.4 33.9 0l96-96c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55V56c0-13.3-10.7-24-24-24s-24 10.7-24 24V398.1L49 343c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9zM312 48c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H312zm0 128c-13.3 0-24 10.7-24 24s10.7 24 24 24H424c13.3 0 24-10.7 24-24s-10.7-24-24-24H312zm0 128c-13.3 0-24 10.7-24 24s10.7 24 24 24H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H312zm0 128c-13.3 0-24 10.7-24 24s10.7 24 24 24H552c13.3 0 24-10.7 24-24s-10.7-24-24-24H312z"
          ></path>
          <path
            v-else
            d="M15 377l96 96c9.4 9.4 24.6 9.4 33.9 0l96-96c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55V56c0-13.3-10.7-24-24-24s-24 10.7-24 24V398.1L49 343c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9zM312 480h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24zm0-128H424c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24zm0-128H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24zm0-128H552c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24z"
          ></path>
        </svg>
        <span class="button-label">{{ selectedRule.label }}</span>
      </template>
    </button>
    <div class="dropdown-content" v-show="isOpen">
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
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="arrow-down-short-wide"
              class="item-icon"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              v-if="sortDirection === 'ASC'"
            >
              <path
                d="M15 377l96 96c9.4 9.4 24.6 9.4 33.9 0l96-96c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55V56c0-13.3-10.7-24-24-24s-24 10.7-24 24V398.1L49 343c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9zM312 48c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H312zm0 128c-13.3 0-24 10.7-24 24s10.7 24 24 24H424c13.3 0 24-10.7 24-24s-10.7-24-24-24H312zm0 128c-13.3 0-24 10.7-24 24s10.7 24 24 24H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H312zm0 128c-13.3 0-24 10.7-24 24s10.7 24 24 24H552c13.3 0 24-10.7 24-24s-10.7-24-24-24H312z"
              ></path>
            </svg>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="arrow-down-wide-short"
              class="item-icon"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              v-else
            >
              <path
                d="M15 377l96 96c9.4 9.4 24.6 9.4 33.9 0l96-96c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55V56c0-13.3-10.7-24-24-24s-24 10.7-24 24V398.1L49 343c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9zM312 480h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24zm0-128H424c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24zm0-128H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24zm0-128H552c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24z"
              ></path>
            </svg>
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
  fill: #7a7a7a;
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
  fill: #7a7a7a;
}

.dropdown-item > .item-type .item-check {
  font-size: 0.9rem;
  font-weight: bold;
  line-height: 1;
  color: #7a7a7a;
}
</style>
