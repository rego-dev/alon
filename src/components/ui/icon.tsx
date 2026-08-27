import type { ComponentProps } from "react";
import { Circle } from "lucide-react";
import { iconRegistry } from "@/lib/icons";

/**
 * Renders an icon by registry name.
 *
 * Data files reference icons by string. Resolving the component inside this
 * wrapper — rather than assigning `const Icon = getIcon(name)` in a caller's
 * render body — keeps React from seeing a component created during render.
 */
export function Icon({
  name,
  ...props
}: { name: string | undefined } & ComponentProps<typeof Circle>) {
  const Resolved = (name && iconRegistry[name]) || Circle;
  return <Resolved {...props} />;
}
