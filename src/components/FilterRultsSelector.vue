<script setup lang="ts">
import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";
import filterIconUrl from "@/assets/icons/filter.svg";

const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();
</script>

<template>
  <div ref="containerRef" class="drop-button-container">
    <button type="button" class="drop-button" @click.stop="toggleDropdown">
      <img
        :src="filterIconUrl"
        class="button-icon"
        alt=""
        aria-hidden="true"
      />
    </button>
    <div class="dropdown-content" v-show="isOpen"></div>
  </div>
</template>

<style scoped lang="css">
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
  min-width: 600%;
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

.dropdown-item:hover {
  background-color: #ccc;
}

.dropdown-item > .item-description {
  font-size: small;
}

.dropdown-item > .item-type {
  display: inline;
}
</style>
