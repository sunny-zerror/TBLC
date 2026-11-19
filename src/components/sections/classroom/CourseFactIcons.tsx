/*
 * Line icons for the course facts that act out their meaning when their card (a `group`) is hovered:
 * the module layers spread, a ring draws round the play button, a workbook page turns, the calendar's
 * tick writes itself in. Strokes take the current text colour. With reduced motion they simply hold.
 */

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "size-5 overflow-visible",
} as const;

const move = "transition-[translate,scale,opacity] duration-700 ease-out-expo";

/** Three layers that fan apart */
function Modules() {
  return (
    <svg {...svg}>
      <path d="M3 15.5l9 5 9-5" className={`${move} group-hover:translate-y-0.5`} />
      <path d="M3 12l9 5 9-5" />
      <path d="M12 3.5l9 5-9 5-9-5z" className={`${move} group-hover:-translate-y-1`} />
    </svg>
  );
}

/** A ring draws round from the top while the play mark nudges forward */
function Video() {
  return (
    <svg {...svg}>
      <circle cx="12" cy="12" r="9" className="opacity-35" />
      <circle
        cx="12"
        cy="12"
        r="9"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="1"
        // Hidden at rest too: a round cap would leave a dot where the undrawn ring starts
        className="origin-center -rotate-90 opacity-0 transition-[stroke-dashoffset,opacity] duration-1000 ease-out-expo transform-fill group-hover:opacity-100 group-hover:[stroke-dashoffset:0]"
      />
      <path
        d="M10 8.5v7l5.5-3.5z"
        fill="currentColor"
        className={`${move} origin-center transform-fill group-hover:translate-x-0.5 group-hover:scale-110`}
      />
    </svg>
  );
}

/** An open book; on hover a solid page lifts off the right, swings over the spine and settles away */
function Workbook() {
  return (
    <svg {...svg}>
      <path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5" />
      <path d="M12 6.5C14 5 17 4.5 21 5v13c-4-.5-7 0-9 1.5" />
      <path d="M12 6.5v13" />
      {/* The turning page, hinged on the spine (x = 12); filled with the hovered badge colour so it hides the lines it passes */}
      <path
        d="M12 6.5C14 5 17 4.5 21 5v13c-4-.5-7 0-9 1.5z"
        className="origin-[12px_12px] fill-accent opacity-0 group-hover:animate-page-turn"
      />
    </svg>
  );
}

/** A calendar whose tick is written in afresh */
function Access() {
  return (
    <svg {...svg}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M9 15.5l2 2 4-4" pathLength={1} strokeDasharray="1" className="group-hover:animate-draw" />
    </svg>
  );
}

/** One per fact, in the order of courseFacts */
export const COURSE_FACT_ICONS = [Modules, Video, Workbook, Access];
