<script setup lang="ts">
import tagIconUrl from "@/assets/icons/tag.svg"
import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";

const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();

const handleSelected = (ruleType: string) => {
  toggleDropdown();
  console.log(ruleType);
};
</script>

<template>
  <div ref="containerRef" class="drop-button-container">
    <button type="button" @click="toggleDropdown" class="add-rule-button">
      +
    </button>
    <div v-show="isOpen" class="dropdown-content">
      <span class="dropdown-item" @click="handleSelected('tag')">
        <img class="icon" :src="tagIconUrl"/>
        标签
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
