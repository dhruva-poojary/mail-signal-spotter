/**
 * Chart.js cannot parse oklch() strings, so resolve design tokens to rgba via a 1px canvas.
 */
export function resolveToken(name: string, alpha = 1): string {
  if (typeof document === "undefined") return "rgba(0,0,0,1)";
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx || !value) return "rgba(0,0,0,1)";
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
