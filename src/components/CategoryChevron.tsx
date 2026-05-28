/**
 * Inline chevron-down icon used by the category/dashboard CTA pills
 * that open a bottom sheet (Casino → Categories, Casino category
 * pages → Jackpots/Tables/etc., Arena → Dashboard).
 *
 * The icon is intentionally tiny (a single open chevron with stroke
 * caps) so it reads as a quiet affordance on the right edge of the
 * label, in the same visual weight as the text itself. Stroke uses
 * `currentColor` so the chevron inherits the pill's text colour with
 * no extra plumbing.
 *
 * Previously these CTAs used a literal "+" appended to the label
 * (e.g. "Categories+", "Dashboard+", "Jackpots+"). The chevron-down
 * reads more clearly as "tap to open a sheet" than a "+" does — "+"
 * tends to suggest "add" rather than "expand" — so the whole family
 * switched at once for consistency.
 */
export function ChevronDownIcon({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <path d="M3 5.5 7 9.5l4-4" />
    </svg>
  );
}
