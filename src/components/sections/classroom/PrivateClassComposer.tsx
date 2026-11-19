"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { classroomLinks, privateClassPaces, privateClassPlaces, privateClassSubjects } from "@/data/classroom";

const chip =
  "cursor-pointer rounded-full border border-accent px-4 py-2 text-caption transition-colors duration-300 hover:bg-surface has-checked:bg-accent has-checked:text-cream has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent";

/** One choice as a row of radio chips, numbered like a step */
function Step({
  index,
  legend,
  name,
  options,
  value,
  onChange,
}: {
  index: number;
  legend: string;
  name: string;
  options: string[];
  value: number;
  onChange: (index: number) => void;
}) {
  return (
    <fieldset className="border-t border-line pt-5">
      <legend className="float-left flex w-full gap-3 text-eyebrow text-muted">
        <span className="text-accent tabular-nums">{String(index).padStart(2, "0")}</span>
        {legend}
      </legend>
      <div className="clear-both flex flex-wrap gap-2 pt-4">
        {options.map((option, i) => (
          <label key={option} className={chip}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === i}
              onChange={() => onChange(i)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A chosen word in the enquiry: keyed by its text, so a new choice rolls in from below */
function Choice({ children }: { children: string }) {
  return (
    <em key={children} className="inline-block animate-count-up text-flourish text-accent">
      {children}
    </em>
  );
}

/*
 * "Compose your class": pick a script, a place and a pace, and the enquiry writes itself in a line
 * underneath, each changed word rolling in. The main button opens WhatsApp with that line ready to
 * send; the enquiry form stays one link away.
 */
export default function PrivateClassComposer() {
  const [script, setScript] = useState(0);
  const [place, setPlace] = useState(0);
  const [pace, setPace] = useState(0);

  const subject = privateClassSubjects[script];
  const where = privateClassPlaces[place].phrase;
  const when = privateClassPaces[pace].phrase;
  const message = `Hello! I'd like to learn ${subject} ${where}, ${when}. Could you tell me more about private classes?`;
  const whatsapp = `https://wa.me/${siteConfig.contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <div className="rounded-2xl bg-cream grain p-6 shadow-2xl shadow-accent/15 md:p-10">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-title-sm">
          Compose <em className="text-flourish text-accent">your class</em>
        </p>
        <p className="text-eyebrow text-muted">One to one</p>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <Step
          index={1}
          legend="Your script"
          name="private-script"
          options={privateClassSubjects}
          value={script}
          onChange={setScript}
        />
        <Step
          index={2}
          legend="Where"
          name="private-place"
          options={privateClassPlaces.map((p) => p.label)}
          value={place}
          onChange={setPlace}
        />
        <Step
          index={3}
          legend="Your pace"
          name="private-pace"
          options={privateClassPaces.map((p) => p.label)}
          value={pace}
          onChange={setPace}
        />
      </div>

      {/* The enquiry, written from the choices above */}
      <div className="mt-8 rounded-xl bg-surface p-5 md:p-6">
        <p className="text-eyebrow text-muted">Your message</p>
        <p aria-live="polite" className="mt-3 text-lead">
          I&apos;d like to learn <Choice>{subject}</Choice> <Choice>{where}</Choice>, <Choice>{when}</Choice>.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <ButtonLink href={whatsapp} target="_blank" rel="noopener noreferrer" variant="accent" size="lg">
          <em className="text-flourish">Ask on</em> WHATSAPP
        </ButtonLink>
        <Link href={classroomLinks.privateClasses} className="link-line text-cta">
          Or send an enquiry
        </Link>
      </div>
    </div>
  );
}
