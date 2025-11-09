<script setup lang="ts">
import TagMultiSelect from "@/components/TagMultiSelect.vue";
</script>

<template>
  <div class="filter-rule-container">
    <span class="description">标签</span>
    <select class="rule-term">
      <option value="eq">等于</option>
      <option value="ne">不等于</option>
    </select>
    <div class="rule">
      <tag-multi-select />
    </div>
    <button type="button" class="remove-rule-btn">—</button>
  </div>
</template>

<style lang="css" scoped>
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
