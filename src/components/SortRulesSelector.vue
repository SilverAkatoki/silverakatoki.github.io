<script setup lang="ts">
import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";
import { ref } from "vue";

const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();

const selectedRules = ref("默认排序");
const isAscending = ref(false);

const handleSelectRule = (rule: string) => {
  if (selectedRules.value !== rule) {
    selectedRules.value = rule;
    isAscending.value = false;
  } else {
    isAscending.value = !isAscending.value;
  }
};
</script>

<template>
  <div ref="containerRef" class="drop-button-container">
    <button type="button" class="drop-button" @click.stop="toggleDropdown">
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
    </button>
    <div class="dropdown-content" v-show="isOpen">
      <div
        class="dropdown-item"
        :class="{ selected: selectedRules === '默认排序' }"
        @click="handleSelectRule('默认排序')"
      >
        <span class="item-description">默认排序</span>
        <div class="item-type default" v-if="selectedRules === '默认排序'">
          ✓
        </div>
      </div>
      <div
        class="dropdown-item"
        :class="{ selected: selectedRules === '创建日期' }"
        @click="handleSelectRule('创建日期')"
      >
        <span class="item-description">创建日期</span>
        <div class="item-type" v-if="selectedRules === '创建日期'">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            data-icon="arrow-down-short-wide"
            class="search-icon"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            v-if="isAscending"
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
            class="search-icon"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            v-else="isAscending"
          >
            <path
              d="M15 377l96 96c9.4 9.4 24.6 9.4 33.9 0l96-96c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55V56c0-13.3-10.7-24-24-24s-24 10.7-24 24V398.1L49 343c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9zM312 480h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24zm0-128H424c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24zm0-128H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24zm0-128H552c13.3 0 24-10.7 24-24s-10.7-24-24-24H312c-13.3 0-24 10.7-24 24s10.7 24 24 24z"
            ></path>
          </svg>
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

.search-icon {
  position: absolute;
  right: 5px;
  width: 1.1rem;
  height: 1.1rem;
  pointer-events: none;
  transform: translateY(-50%);
  fill: #7a7a7a;
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

.dropdown-item.selected {
  background-color: #eee;
}

.dropdown-item > .item-description {
  font-size: small;
}

.dropdown-item > .item-type {
  display: inline;
}
</style>
