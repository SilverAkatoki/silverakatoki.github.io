<script setup lang="ts">
import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";
import filterIconUrl from "@/assets/icons/filter.svg";
import RuleMultiSelect from "@/components/RuleMultiSelect.vue";

const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();
</script>

<template>
  <div ref="containerRef" class="drop-button-container">
    <button type="button" class="drop-button" @click="toggleDropdown">
      <img :src="filterIconUrl" class="button-icon" alt="" aria-hidden="true" />
    </button>
    <div class="dropdown-content" v-show="isOpen">
      <div class="filter-content">
        <div class="filter-term">
          匹配
          <select>
            <option value="all">所有</option>
            <option value="some">任一</option>
          </select>
          过滤条件：
        </div>
        <div class="filter-rules">
          <div class="filter-rule-container">
            <span class="description">类别</span>
            <select class="rule-term">
              <option value="eq">等于</option>
              <option value="ne">不等于</option>
            </select>
            <select class="rule">
              <option value="fiction">小说</option>
            </select>
            <button type="button" class="remove-rule-btn">—</button>
          </div>
          <div class="filter-rule-container">
            <span class="description">类别</span>
            <select class="rule-term">
              <option value="eq">等于</option>
              <option value="ne">不等于</option>
            </select>
            <div class="rule">
              <rule-multi-select />
            </div>
            <button type="button" class="remove-rule-btn">—</button>
          </div>
          <button type="button" class="add-rule-btn">+</button>
        </div>
        <div class="filter-bottom">
          <button type="button">重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
rule-multi-select {
  height: 100%;
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
  width: 1300%;   
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
