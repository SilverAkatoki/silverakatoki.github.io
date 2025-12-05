import { ref, onMounted, onBeforeUnmount } from "vue";


export const useToggleDropdownMenu = () => {
  const isOpen = ref(false);

  const containerRef = ref<HTMLElement | null>(null);
  const container = containerRef.value;
  const toggleDropdown = () => (isOpen.value = !isOpen.value);

  const closeDropdown = () => (isOpen.value = false);

  const handleClickOutside = (event: MouseEvent) => {
    // 不做特判会让整个页面无法点击
    // 因为下面修改了事件的捕获和冒泡行为，会在捕获的时候就触发
    // 不这样的话，冒泡的先是元素，再是document，事件会被其他元素（比如超链接）抓走
    if (!isOpen.value) return;

    event.preventDefault();
    event.stopPropagation();

    const target = event.target as Node | null;
    if (container && target && !container.contains(target)) {
      closeDropdown();
    }
  };

  onMounted(() => {
    document.addEventListener("click", handleClickOutside, true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  return {
    containerRef,
    isOpen,
    toggleDropdown
  };
};


