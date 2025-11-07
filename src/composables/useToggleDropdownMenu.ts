import { ref, onMounted, onBeforeUnmount } from "vue";


export const useToggleDropdownMenu = () => {
  const isOpen = ref(false);

  const containerRef = ref<HTMLElement | null>(null);
  const toggleDropdown = () => (isOpen.value = !isOpen.value);

  const closeDropdown = () => (isOpen.value = false);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node | null;
    if (containerRef.value && target && !containerRef.value.contains(target)) {
      closeDropdown();
    }
  };

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
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


