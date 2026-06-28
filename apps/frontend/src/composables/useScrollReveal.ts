import { ref, onMounted, onUnmounted } from "vue";

export function useScrollReveal(threshold: number = 0.1) {
  const isVisible = ref(false);
  const elementRef = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver | null = null;

  const observe = () => {
    if (!elementRef.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true;
          }
        });
      },
      { threshold }
    );

    observer.observe(elementRef.value);
  };

  onMounted(() => {
    observe();
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return {
    elementRef,
    isVisible,
  };
}
