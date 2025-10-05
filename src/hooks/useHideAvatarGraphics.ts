import { useEffect } from "react";
import { useAvatarGraphics } from "@/stores/useAvatarGraphics";

/**
 * Hook controlling avatar graphics visibility.
 * @param threshold viewport height in px below which graphics are hidden.
 */
export function useHideAvatarGraphics(threshold: number = 800, enabled = true) {
  const { hide, show } = useAvatarGraphics();

  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      const shouldHide = window.innerHeight <= threshold;
      if (shouldHide) hide();
      else show();
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [enabled, threshold, hide, show]);
}
