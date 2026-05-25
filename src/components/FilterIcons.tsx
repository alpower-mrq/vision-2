/**
 * Top sub-filter pill icons — inlined React SVG components.
 *
 * Originally these were rendered via `mask-image: url(/assets/icon-*.svg)`,
 * but Figma's exported SVGs declare `width="100%" height="100%"` with no
 * concrete intrinsic dimensions. When used as a CSS mask, browsers
 * interpret that as "no intrinsic size", so `mask-size: contain` couldn't
 * preserve the aspect ratio — the icons stretched to fill whatever box
 * the mask was rendered into. Inlining the paths as React components
 * sidesteps the whole CSS-mask quirk:
 *
 *   • Each icon has a real `viewBox` so it scales uniformly
 *   • `preserveAspectRatio="xMidYMid meet"` (the default) is honoured
 *   • Fills and strokes use `currentColor` so the pill's text colour
 *     flows straight through — no extra plumbing needed
 *
 * The four icons are pulled straight from the Figma exports — path
 * data is identical, only the wrapping changed.
 */

type IconProps = { className?: string };

function baseProps(viewBox: string) {
  return {
    viewBox,
    // Render at the size set by `className` (defaults to 1em via parent).
    // Width/height attributes are intentionally omitted — the consumer
    // controls the rendered box via CSS so the icon scales with the
    // text it sits next to.
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
    focusable: false as const,
  };
}

export function CasinoIcon({ className }: IconProps) {
  return (
    <svg {...baseProps("0 0 17 12.2559")} className={className}>
      {/* Filled body — the three reels + outer frame */}
      <path
        d="M15.2207 0C16.2029 0.000102549 16.9996 0.796141 17 1.77832V10.4766C16.9999 11.459 16.2031 12.2558 15.2207 12.2559H11.6621C10.6799 12.2556 9.88389 11.4588 9.88379 10.4766V1.77832C9.88414 0.796262 10.68 0.000296632 11.6621 0H15.2207ZM3.75586 0.395508C4.08317 0.395687 4.34854 0.660954 4.34863 0.988281C4.34854 1.31561 4.08317 1.58088 3.75586 1.58105H1.77832C1.4513 1.58145 1.18581 1.84678 1.18555 2.17383V10.0811C1.18556 10.4083 1.45115 10.6734 1.77832 10.6738H3.75586C4.08301 10.674 4.34829 10.9395 4.34863 11.2666C4.34863 11.594 4.08322 11.8602 3.75586 11.8604H1.77832C0.796118 11.86 9.79148e-06 11.0633 0 10.0811V2.17383C0.000263569 1.19175 0.796277 0.395902 1.77832 0.395508H3.75586ZM8.69727 0.395508C9.02472 0.395508 9.28995 0.660844 9.29004 0.988281C9.28995 1.31572 9.02473 1.58105 8.69727 1.58105H6.7207C6.39346 1.58119 6.12819 1.84662 6.12793 2.17383V10.0811C6.12794 10.4085 6.39331 10.6737 6.7207 10.6738H8.69727C9.02457 10.6738 9.2897 10.9394 9.29004 11.2666C9.29004 11.5941 9.02478 11.8604 8.69727 11.8604H6.7207C5.73828 11.8602 4.94142 11.0635 4.94141 10.0811V2.17383C4.94167 1.19159 5.73844 0.395639 6.7207 0.395508H8.69727ZM12.4531 3.55859C12.1257 3.55871 11.8604 3.82393 11.8604 4.15137C11.8605 4.47866 12.1258 4.74402 12.4531 4.74414H13.6338L12.6758 7.93457C12.582 8.24803 12.7599 8.57869 13.0732 8.67285C13.3867 8.7669 13.7172 8.58871 13.8115 8.27539L14.998 4.32129C15.0517 4.14197 15.0169 3.94807 14.9053 3.79785C14.7934 3.64746 14.6171 3.55859 14.4297 3.55859H12.4531Z"
        fill="currentColor"
      />
      {/* Two stroked 7-shapes (the reel digits) */}
      <path
        d="M7.1162 4.34881H8.89525L7.82782 7.90691"
        stroke="currentColor"
        strokeWidth="1.18603"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.17459 4.34881H3.95364L2.88621 7.90691"
        stroke="currentColor"
        strokeWidth="1.18603"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LiveIcon({ className }: IconProps) {
  return (
    <svg {...baseProps("0 0 17.1599 12.6953")} className={className}>
      {/* "A" inside a card body */}
      <path
        d="M14.907 5.34075e-06C16.1507 5.88081e-05 17.1597 1.00823 17.1599 2.25196V10.4424C17.1599 11.6862 16.1508 12.6953 14.907 12.6953H9.99292C8.74918 12.6951 7.741 11.6862 7.74096 10.4424V2.25196C7.74115 1.00832 8.74928 0.000194907 9.99292 5.34075e-06H14.907ZM12.4509 4.50489C12.2558 4.50489 12.0737 4.59731 11.9587 4.75098L11.9138 4.82129L10.321 7.68751L9.86596 8.50684C9.70158 8.80332 9.80882 9.17713 10.1052 9.3418C10.4015 9.5059 10.7755 9.39954 10.9402 9.10352L11.2205 8.59961H13.6814L13.9617 9.10352C14.1267 9.39941 14.5004 9.50639 14.7966 9.3418C15.0929 9.1771 15.1992 8.80326 15.0349 8.50684L14.5798 7.68751L12.988 4.82129C12.8798 4.62646 12.6738 4.5051 12.4509 4.50489ZM12.9998 7.3711H11.9021L12.4509 6.38379L12.9998 7.3711ZM10.4031 1.84278C9.95074 1.84278 9.58374 2.20978 9.58374 2.66211C9.58393 3.11429 9.95086 3.48047 10.4031 3.48047C10.8551 3.48026 11.2212 3.11416 11.2214 2.66211C11.2214 2.20991 10.8552 1.84299 10.4031 1.84278Z"
        fill="currentColor"
      />
      {/* Two stroked dealer hand lines */}
      <path
        d="M6.73662 0.792348L5.77458 1.1425L5.00495 1.42262C4.36737 1.65468 4.03863 2.35967 4.27069 2.99725L5.81136 7.23022L6.30157 8.57707L6.54668 9.2505"
        stroke="currentColor"
        strokeWidth="1.22853"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.74813 8.4587L3.03148 7.21743L0.779168 3.31631C0.439917 2.72871 0.641243 1.97735 1.22884 1.6381L1.93814 1.22859L2.82475 0.716701"
        stroke="currentColor"
        strokeWidth="1.22853"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BingoIcon({ className }: IconProps) {
  return (
    <svg {...baseProps("0 0 16.5776 11.9512")} className={className}>
      {/* Filled "9" ball */}
      <path
        d="M10.602 2.47191e-05C13.9023 3.18696e-05 16.5775 2.67535 16.5776 5.97561C16.5776 9.27597 13.9024 11.9512 10.602 11.9512C7.30171 11.9512 4.62645 9.27595 4.62645 5.97561C4.62656 2.67536 7.30177 6.0282e-05 10.602 2.47191e-05ZM11.3735 3.46975C11.0542 3.46975 10.7955 3.7286 10.7954 4.04788V6.16799H9.63817V4.04788C9.63804 3.72867 9.37926 3.46986 9.06005 3.46975C8.74074 3.46975 8.48205 3.7286 8.48192 4.04788V6.36135C8.48206 6.89355 8.91355 7.32522 9.44579 7.32522H10.7954V7.90335C10.7954 8.22269 11.0542 8.48147 11.3735 8.48147C11.6927 8.48123 11.9516 8.22254 11.9516 7.90335V7.32522H12.144C12.4632 7.32511 12.7229 7.06621 12.7231 6.7471C12.723 6.42789 12.4632 6.1681 12.144 6.16799H11.9516V4.04788C11.9515 3.72875 11.6926 3.46999 11.3735 3.46975Z"
        fill="currentColor"
      />
      {/* Stroked partial ring */}
      <path
        d="M5.20476 10.6023C2.64964 10.6023 0.578306 8.531 0.578306 5.97588C0.578306 3.42076 2.64964 1.34943 5.20476 1.34943"
        stroke="currentColor"
        strokeWidth="1.15661"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArenaIcon({ className }: IconProps) {
  return (
    <svg {...baseProps("0 0 13.5011 13.5005")} className={className}>
      {/* Crossed swords — the main filled silhouette */}
      <path
        d="M1.55273 7.55371C1.84561 7.26083 2.32038 7.26087 2.61328 7.55371L5.28027 10.2207C5.57299 10.5136 5.57311 10.9884 5.28027 11.2812C4.98741 11.5737 4.51252 11.5738 4.21973 11.2812L3.75 10.8115L2.47754 12.084L2.61328 12.2197C2.90614 12.5126 2.90608 12.9874 2.61328 13.2803C2.32039 13.5732 1.84563 13.5732 1.55273 13.2803L0.219727 11.9473C-0.0730707 11.6544 -0.0731347 11.1796 0.219727 10.8867C0.512595 10.5939 0.987403 10.594 1.28027 10.8867L1.41699 11.0234L2.68945 9.75098L1.55273 8.61426C1.26001 8.32148 1.26021 7.84662 1.55273 7.55371ZM2.75 0C2.94889 0 3.13963 0.0791087 3.28027 0.219727L10.417 7.35645L10.8867 6.88672C11.1796 6.59386 11.6544 6.59394 11.9473 6.88672C12.2401 7.17961 12.2401 7.65438 11.9473 7.94727L10.4775 9.41699L12.6143 11.5537C12.907 11.8466 12.9071 12.3214 12.6143 12.6143C12.3214 12.907 11.8466 12.9069 11.5537 12.6143L9.41699 10.4775L7.94727 11.9473C7.65438 12.2401 7.17959 12.2401 6.88672 11.9473C6.59396 11.6544 6.59394 11.1796 6.88672 10.8867L7.35645 10.417L0.219727 3.28027C0.0791087 3.13963 0 2.94889 0 2.75V0.75C0 0.335786 0.335786 0 0.75 0H2.75ZM1.5 2.43945L8.41699 9.35645L9.35645 8.41699L2.43945 1.5H1.5V2.43945ZM12.751 0C13.165 0.000223081 13.501 0.335924 13.501 0.75V2.75C13.501 2.94879 13.4217 3.13965 13.2812 3.28027L10.9473 5.61426C10.6544 5.90679 10.1795 5.9069 9.88672 5.61426C9.59398 5.32146 9.59415 4.84661 9.88672 4.55371L12.001 2.43945V1.5H11.0615L8.94727 3.61426C8.65443 3.90675 8.17953 3.90679 7.88672 3.61426C7.59389 3.32138 7.59389 2.84562 7.88672 2.55273L10.2197 0.219727C10.3602 0.0792038 10.5513 0.000145415 10.75 0H12.751Z"
        fill="currentColor"
      />
      {/* The little spark/clash mark on the lower blade tip — kept as a
          tiny stroked line, in the same currentColor as the swords so
          it reads as part of the icon, not a separate notch. */}
      <path
        d="M11.4172 12.7505L12.7507 11.4171"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
