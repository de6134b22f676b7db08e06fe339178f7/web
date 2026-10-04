"use client";
/**
 * next/link with intent prefetch. Viewport prefetch is off (it fired ~400ms after first paint, under the loader,
 * and injected <link rel=preload as=style> for every linked route's CSS, which Chrome then flagged as unused).
 * The route is prefetched on pointerenter / focus / touchstart instead, so whatever loads is used within seconds.
 */
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, type ComponentProps } from "react";

type Props = ComponentProps<typeof NextLink>;

const IntentLink = forwardRef<HTMLAnchorElement, Props>(function IntentLink({ href, onPointerEnter, onFocus, onTouchStart, ...rest }, ref) {
  const router = useRouter();
  const path = typeof href === "string" ? href : (href.pathname ?? "");
  const warm = () => {
    if (path.startsWith("/")) router.prefetch(path.split("#")[0] || "/");
  };
  return (
    <NextLink
      ref={ref}
      href={href}
      prefetch={false}
      onPointerEnter={(e) => (warm(), onPointerEnter?.(e))}
      onFocus={(e) => (warm(), onFocus?.(e))}
      onTouchStart={(e) => (warm(), onTouchStart?.(e))}
      {...rest}
    />
  );
});

export default IntentLink;
