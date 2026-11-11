import Link from "next/link";
import { cn } from "@/utils/cn";

/*
 * primary / outline / ghost: small uppercase UI buttons.
 * accent / paper: the storefront's serif CTAs — "Buy NOW", "Add to BAG". Pair their label
 * with <em className="text-flourish"> for the italic half: <em>Check</em> OUT.
 * On hover the label rolls up and a copy rolls in from below (all but ghost, which underlines).
 */
type Variant = "primary" | "outline" | "ghost" | "accent" | "paper";
type Size = "md" | "lg";

const base =
  "group/button inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors duration-500 disabled:pointer-events-none disabled:opacity-50";

const cta = "text-cta";
const serif = "text-lead";

const variants: Record<Variant, string> = {
  primary: `${cta} bg-ink text-cream hover:bg-ink/85`,
  outline: `${cta} border border-ink text-ink hover:bg-ink hover:text-cream`,
  ghost: `${cta} link-line text-ink`,
  accent: `${serif} bg-accent text-cream hover:bg-ink`,
  paper: `${serif} border border-ink bg-cream text-ink hover:bg-ink hover:text-cream`,
};

const face = "inline-flex items-center justify-center gap-1.5 transition-transform duration-700 ease-out-expo";

/** The label twice in a clipped box: on hover the first rolls up and the copy (aria-hidden) rolls in */
function RollingLabel({ children }: { children: React.ReactNode }) {
  return (
    // Padded out (and pulled back) so italic overhangs and descenders aren't clipped
    <span className="relative m-[-0.15em] inline-flex overflow-hidden p-[0.15em]">
      <span className={cn(face, "group-hover/button:translate-y-[-120%]")}>{children}</span>
      <span
        aria-hidden="true"
        className={cn(face, "absolute inset-0 translate-y-[120%] group-hover/button:translate-y-0")}
      >
        {children}
      </span>
    </span>
  );
}

const label = (variant: Variant | undefined, children: React.ReactNode) =>
  variant === "ghost" ? children : <RollingLabel>{children}</RollingLabel>;

const sizes: Record<Size, string> = {
  md: "h-11 px-6",
  lg: "h-13 px-8",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
}

export const buttonClass = ({ variant = "primary", size = "md", fullWidth, className }: StyleProps = {}) =>
  cn(base, variants[variant], variant !== "ghost" && sizes[size], fullWidth && "w-full", className);

type ButtonProps = StyleProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

export function Button({ variant, size, fullWidth, className, loading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={buttonClass({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        label(variant, children)
      )}
    </button>
  );
}

type ButtonLinkProps = StyleProps & React.ComponentProps<typeof Link>;

export function ButtonLink({ variant, size, fullWidth, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClass({ variant, size, fullWidth, className })} {...props}>
      {label(variant, children)}
    </Link>
  );
}
