/*
 * Site-wide scroll animations, driven by data attributes. <Motion /> (mounted once in
 * AppProviders) picks them up whenever they enter the DOM — first load, navigation, client
 * renders — so pages and components only add the attribute:
 *
 *   data-heading-effect      headings: masked lines slide up        ="words" → word by word
 *   data-fade                a block fades up a touch (buttons, a key block)   ="down" | ="in" (no movement)
 *   data-stagger             its children fade up one after another, row by row   ="0.15" → gap
 *   data-slide-in            its children slide in from the right edge of the screen, 0.35s apart,
 *                            and back out when you scroll above it   ="left" → from the left
 *   data-image-reveal        a media wrapper fades in out of a soft blur while the image settles
 *                            ="zoom" → no fade, visible from first paint (for a page's main image)
 *   data-parallax            an image (inside a clipped wrapper) drifts with the scroll   ="0.2" → depth
 *   data-counter             a number counts up: "100+" → 0+ … 100+
 *   data-draw                a hairline draws in from the left
 *   data-delay="0.2"         extra delay in seconds, for any of the above
 *
 * Rules of thumb
 * - Keep it minimal: in a section, animate the heading, its key image and its main button(s).
 *   Paragraphs, labels, meta lines, lists, forms and site chrome stay still.
 * - The heading effect splits the element's text into lines, so use it only on text that doesn't
 *   change while mounted (or key the element by its text), and not on elements with flex/grid children.
 * - Every reveal plays on the way down and reverses when you scroll back above it
 *   (toggleActions "play none none reverse"); data-parallax scrubs instead.
 * - Don't nest effects that move the same thing (e.g. data-fade inside data-stagger).
 */
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

/** The motion language — one ease and rhythm everywhere (expo.out = --ease-out-expo) */
export const MOTION = {
  ease: "expo.out",
  wipe: "expo.inOut",
  duration: 1.4,
  stagger: 0.1,
  /** Animate when the element's top passes 88% of the viewport height */
  start: "top 88%",
} as const;

/** Before <Motion /> wires an element up, CSS keeps it hidden (see "Motion" in globals.css) */
export const READY_ATTR = "data-motion-ready";

type Effect = (el: HTMLElement, delay: number) => void | (() => void);

const inViewport = (el: Element) => {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

/**
 * When an element plays: already on screen when it's wired up → straight away (so nothing low in
 * the first view waits for a scroll); otherwise once its top rises past MOTION.start. clamp()
 * lets elements at the very end of the page, which can never scroll that high, still play.
 */
const startFor = (el: Element) => (inViewport(el) ? "top bottom" : `clamp(${MOTION.start})`);

/** Every reveal plays on the way down and reverses when you scroll back above its start */
const TOGGLE = "play none none reverse";

const onScroll = (trigger: Element): ScrollTrigger.Vars => ({
  trigger,
  start: startFor(trigger),
  toggleActions: TOGGLE,
});

const parallaxDepth = (el: HTMLElement) => parseFloat(el.dataset.parallax ?? "") || 0.12;
/** Scale that keeps a parallax image covering its frame at both ends of its travel */
const parallaxScale = (el: HTMLElement) => (el.hasAttribute("data-parallax") ? 1 + parallaxDepth(el) : 1);

const EFFECTS = {
  "data-heading-effect": (el, delay) => {
    const byWords = el.dataset.headingEffect === "words";
    SplitText.create(el, {
      type: byWords ? "words" : "lines",
      mask: byWords ? "words" : "lines",
      linesClass: "split-line",
      wordsClass: "split-word",
      // Re-splits when fonts load or the width changes; returning the tween keeps its progress
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(byWords ? self.words : self.lines, {
          // Far enough to clear the mask's extended clip (see .split-line-mask)
          yPercent: 130,
          duration: MOTION.duration,
          ease: MOTION.ease,
          stagger: byWords ? 0.06 : MOTION.stagger,
          delay,
          scrollTrigger: onScroll(el),
        }),
    });
  },

  "data-fade": (el, delay) => {
    const mode = el.dataset.fade;
    gsap.from(el, {
      autoAlpha: 0,
      y: mode === "in" ? 0 : mode === "down" ? -12 : 16,
      duration: 0.9,
      ease: "power2.out",
      delay,
      clearProps: "transform",
      scrollTrigger: onScroll(el),
    });
  },

  "data-stagger": (el, delay) => {
    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return;
    const gap = parseFloat(el.dataset.stagger ?? "") || MOTION.stagger;
    const starts = new Map(items.map((item) => [item, startFor(item)]));
    gsap.set(items, { autoAlpha: 0, y: 20 });
    // One trigger per item, played in batches: a grid reveals row by row as it scrolls in, and
    // hides again row by row when you scroll back above it (batch has no toggleActions, so the
    // reverse is its own tween)
    ScrollTrigger.batch(items, {
      start: (self) => starts.get(self.trigger as HTMLElement) ?? `clamp(${MOTION.start})`,
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          stagger: gap,
          delay,
          overwrite: true,
        }),
      onLeaveBack: (batch) =>
        gsap.to(batch, { autoAlpha: 0, y: 20, duration: 0.5, ease: "power2.in", stagger: gap / 2, overwrite: true }),
    });
  },

  "data-slide-in": (el, delay) => {
    const items = (Array.from(el.children) as HTMLElement[]).filter((item) => item.offsetWidth > 0);
    if (items.length === 0) return;
    const fromLeft = el.dataset.slideIn === "left";
    // Distance from the item's place to just past the screen edge, as a percentage of its own
    // width. Measured from layout (offsetLeft), not getBoundingClientRect, so it's still right
    // when re-measured on resize while the item is mid-flight or parked off screen.
    const offscreen = (item: HTMLElement) => {
      const parent = item.offsetParent?.getBoundingClientRect().left ?? 0;
      const left = parent + item.offsetLeft;
      // A rotated item's corners stick out past its layout box; clear those too. (The bounding
      // box's width ignores translation, so this holds wherever the item currently is.)
      const overhang = Math.max(0, (item.getBoundingClientRect().width - item.offsetWidth) / 2);
      const distance = fromLeft ? -(left + item.offsetWidth + overhang) : window.innerWidth - left + overhang;
      return (distance / item.offsetWidth) * 100;
    };
    // A fresh vars object each time: GSAP may annotate the ones it's given
    const parked = () => ({ xPercent: (_: number, item: HTMLElement) => offscreen(item) });
    // Park every item off screen now: immediateRender on a staggered fromTo only renders the first
    gsap.set(items, parked());
    gsap.fromTo(items, parked(), {
      xPercent: 0,
      duration: MOTION.duration,
      ease: MOTION.ease,
      stagger: 0.35,
      delay,
      immediateRender: false,
      // Plays on the way down, slides back out if you scroll back above the start
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        toggleActions: TOGGLE,
        invalidateOnRefresh: true,
      },
    });
  },

  "data-image-reveal": (el, delay) => {
    // ="zoom": no fade, the image is visible from first paint and only settles — use it for the
    // page's main (LCP) image, so the reveal never delays Largest Contentful Paint
    const zoomOnly = el.dataset.imageReveal === "zoom";
    const media = el.querySelector<HTMLElement>("img, video");
    const settle = media ? parallaxScale(media) : 1;
    const tl = gsap.timeline({ delay, scrollTrigger: onScroll(el) });
    if (!zoomOnly) {
      // Comes into focus: fades up out of a soft blur. The filter is cleared afterwards — a resting
      // blur(0) still costs a compositing layer
      tl.fromTo(
        el,
        { autoAlpha: 0, filter: "blur(16px)" },
        {
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power2.out",
          immediateRender: true,
          clearProps: "filter",
        },
      );
    }
    if (media) {
      tl.fromTo(
        media,
        // A gentle settle under the fade; the zoom variant starts where its CSS pre-scale left it (see globals.css)
        { scale: settle + (zoomOnly ? 0.12 : 0.08) },
        { scale: settle, duration: 1.8, ease: MOTION.ease, immediateRender: true },
        0,
      );
    }
  },

  "data-parallax": (el) => {
    const depth = parallaxDepth(el);
    gsap.set(el, { scale: 1 + depth });
    gsap.fromTo(
      el,
      { yPercent: -depth * 50 },
      {
        yPercent: depth * 50,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  },

  "data-counter": (el, delay) => {
    // Animate the existing text node, so React's reference to it stays valid
    const node = el.firstChild;
    if (!(node instanceof Text)) return;
    const original = node.data;
    const match = original.match(/^(\D*)([\d.,]+)([\s\S]*)$/);
    if (!match) return;
    const [, prefix, digits, suffix] = match;
    const decimals = digits.split(".")[1]?.length ?? 0;
    const format = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const state = { value: 0 };
    const render = () => (node.data = `${prefix}${format.format(state.value)}${suffix}`);
    render();
    gsap.to(state, {
      value: parseFloat(digits.replace(/,/g, "")),
      duration: 2,
      ease: MOTION.ease,
      delay,
      onUpdate: render,
      onComplete: () => (node.data = original),
      scrollTrigger: onScroll(el),
    });
    return () => (node.data = original);
  },

  "data-draw": (el, delay) => {
    gsap.from(el, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.6,
      ease: MOTION.wipe,
      delay,
      scrollTrigger: onScroll(el),
    });
  },
} satisfies Record<string, Effect>;

type EffectAttr = keyof typeof EFFECTS;
const ATTRS = Object.keys(EFFECTS) as EffectAttr[];
const SELECTOR = ATTRS.map((attr) => `[${attr}]`).join(",");

/** The CSS failsafe (globals.css) shows a hidden element 3s after it's inserted if JS hasn't started it */
const FAILSAFE_MS = 3000;
/** Give up waiting for React to hydrate an element after this long and start it anyway */
const HYDRATION_WAIT_MS = 2000;

/**
 * Has React hydrated (or created) this node yet? Streamed Suspense HTML sits in the DOM before
 * React hydrates it, and splitting its text first would make hydration fail. React tags the
 * nodes it owns with a `__reactFiber$…` property, so wait for that.
 */
const isHydrated = (el: Element) => Object.keys(el).some((key) => key.startsWith("__reactFiber$"));

/**
 * Wires up every effect element under `root`, now and as React adds more (navigation, client
 * renders, streaming). Each element gets its own gsap.context, killed when it leaves the DOM.
 * Returns a teardown that reverts everything.
 */
export function startMotion(root: HTMLElement = document.body) {
  const live = new Map<HTMLElement, gsap.Context>();
  const queue = new Set<HTMLElement>();
  /** When each element was first seen — the server HTML counts as seen at page start */
  const seen = new WeakMap<HTMLElement, number>();
  let frame = 0;

  const start = (el: HTMLElement) => {
    if (live.has(el) || !el.isConnected) return;
    const delay = parseFloat(el.dataset.delay ?? "") || 0;
    const ctx = gsap.context(() => {
      const cleanups = ATTRS.filter((attr) => el.hasAttribute(attr)).map((attr) => EFFECTS[attr](el, delay));
      return () => cleanups.forEach((cleanup) => cleanup?.());
    });
    live.set(el, ctx);
    el.setAttribute(READY_ATTR, "");
  };

  const stop = (el: HTMLElement) => {
    live.get(el)?.kill();
    live.delete(el);
  };

  /** Starts what it can; returns false if the element should wait another frame */
  const tryStart = (el: HTMLElement) => {
    if (live.has(el) || !el.isConnected) return true;
    const age = performance.now() - (seen.get(el) ?? 0);
    if (!isHydrated(el) && age < HYDRATION_WAIT_MS) return false;
    // Already shown by the failsafe: don't hide it again just to replay the entrance
    if (age > FAILSAFE_MS && inViewport(el)) {
      el.setAttribute(READY_ATTR, "");
      return true;
    }
    start(el);
    return true;
  };

  // Elements start on the next frame — after Next has reset the scroll position for a new page,
  // but before the browser paints them. Unhydrated ones stay queued and are retried every frame.
  const flush = () => {
    frame = 0;
    queue.forEach((el) => tryStart(el) && queue.delete(el));
    if (queue.size) frame = requestAnimationFrame(flush);
  };
  const enqueue = (el: HTMLElement) => {
    if (!seen.has(el)) seen.set(el, performance.now());
    queue.add(el);
    frame ||= requestAnimationFrame(flush);
  };

  const eachEffect = (node: Node, fn: (el: HTMLElement) => void) => {
    if (!(node instanceof HTMLElement)) return;
    if (node.matches(SELECTOR)) fn(node);
    node.querySelectorAll<HTMLElement>(SELECTOR).forEach(fn);
  };

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      // React can reuse an existing node and just add the attribute (e.g. a loading <div>
      // re-rendered as the empty state), so an effect attribute appearing counts too
      if (record.type === "attributes") {
        eachEffect(record.target, enqueue);
        continue;
      }
      record.removedNodes.forEach((node) => {
        // Moved nodes (e.g. Swiper's loop reordering slides) are still connected: leave them be
        if (!node.isConnected) eachEffect(node, stop);
      });
      record.addedNodes.forEach((node) => eachEffect(node, enqueue));
    }
  });

  root.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
    seen.set(el, 0);
    enqueue(el);
  });
  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ATTRS });

  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    queue.clear();
    live.forEach((ctx, el) => {
      ctx.revert();
      el.removeAttribute(READY_ATTR);
    });
    live.clear();
  };
}
