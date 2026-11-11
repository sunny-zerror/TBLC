import { useId } from "react";
import { cn } from "@/utils/cn";

/** box: bordered inputs (account, auth, contact). line: underlined inputs on the page (checkout). */
export type FieldVariant = "box" | "line";

const fieldClasses: Record<FieldVariant, string> = {
  box: "h-12 w-full border border-line bg-cream px-4 text-body outline-none transition-colors focus:border-ink aria-[invalid=true]:border-sale",
  line: "h-11 w-full border-0 border-b border-ink bg-transparent px-0 text-body outline-none transition-colors focus:border-accent aria-[invalid=true]:border-sale",
};

const labelClasses: Record<FieldVariant, string> = {
  box: "text-caption text-muted",
  line: "text-eyebrow text-ink",
};

interface FieldShellProps {
  label: string;
  variant?: FieldVariant;
  error?: string;
  hint?: string;
  className?: string;
  children: (id: string, describedBy?: string) => React.ReactNode;
}

function FieldShell({ label, variant = "box", error, hint, className, children }: FieldShellProps) {
  const id = useId();
  const describedBy = error || hint ? `${id}-note` : undefined;
  return (
    <div className={cn("flex flex-col", variant === "line" ? "gap-1" : "gap-1.5", className)}>
      <label htmlFor={id} className={labelClasses[variant]}>
        {label}
      </label>
      {children(id, describedBy)}
      {(error || hint) && (
        <p id={describedBy} className={cn("text-caption", error ? "text-sale" : "text-muted")}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  variant?: FieldVariant;
};

export function TextField({ label, error, hint, variant = "box", className, ...props }: TextFieldProps) {
  return (
    <FieldShell label={label} variant={variant} error={error} hint={hint} className={className}>
      {(id, describedBy) => (
        <input
          id={id}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={fieldClasses[variant]}
          {...props}
        />
      )}
    </FieldShell>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string };

export function TextArea({ label, error, className, ...props }: TextAreaProps) {
  return (
    <FieldShell label={label} error={error} className={className}>
      {(id, describedBy) => (
        <textarea
          id={id}
          rows={5}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(fieldClasses.box, "h-auto py-3")}
          {...props}
        />
      )}
    </FieldShell>
  );
}

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  variant?: FieldVariant;
  options: { value: string; label: string }[];
};

export function SelectField({ label, error, variant = "box", options, className, ...props }: SelectFieldProps) {
  return (
    <FieldShell label={label} variant={variant} error={error} className={className}>
      {(id, describedBy) => (
        <select
          id={id}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={fieldClasses[variant]}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label: React.ReactNode };

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-3 text-caption", className)}>
      <input type="checkbox" className="size-4 shrink-0 accent-accent" {...props} />
      <span>{label}</span>
    </label>
  );
}

/** Reads a submitted form as a plain string record */
export const formValues = (form: HTMLFormElement) =>
  Object.fromEntries(Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v).trim()]));
