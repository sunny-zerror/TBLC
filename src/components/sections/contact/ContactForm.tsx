"use client";

import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextArea, TextField, formValues } from "@/components/ui/form";
import { enquiryTopics } from "@/data/contact";
import { CREATE_CONTACT } from "@/graphql";
import { isApiConfigured } from "@/lib/env";
import { toast } from "@/store/toast-store";
import { errorMessage } from "@/utils/errors";

/** Topic chips (sent as the subject), then underlined fields and the serif send button */
export default function ContactForm() {
  const [createContact, { loading }] = useMutation(CREATE_CONTACT);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!isApiConfigured) {
      toast.info("Demo mode — connect z-commerce in .env.local to send messages.");
      return;
    }
    const { name, email, phoneNumber, subject, message } = formValues(form);
    try {
      await createContact({
        variables: { input: { name, email, phoneNumber: phoneNumber || undefined, subject, message } },
      });
      form.reset();
      setSent(true);
    } catch (error) {
      toast.error(errorMessage(error, "Your enquiry didn't send. Please try again."));
    }
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 bg-surface grain p-8 md:p-12">
        <h2 className="text-title">
          Thank <em className="text-flourish text-accent">you.</em>
        </h2>
        <p className="text-body text-muted">We&apos;ve received your enquiry and will be in touch shortly.</p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-x-8 gap-y-10 md:grid-cols-2">
      <fieldset className="md:col-span-2">
        <legend className="text-eyebrow text-ink">I&apos;m enquiring about</legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {enquiryTopics.map((topic, i) => (
            <label
              key={topic}
              className="cursor-pointer border border-ink px-3 py-2 text-eyebrow transition-colors duration-500 hover:bg-surface has-checked:bg-ink has-checked:text-cream has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
            >
              <input type="radio" name="subject" value={topic} defaultChecked={i === 0} className="sr-only" />
              {topic}
            </label>
          ))}
        </div>
      </fieldset>

      <TextField variant="line" label="Name" name="name" autoComplete="name" required />
      <TextField variant="line" label="E-mail" name="email" type="email" autoComplete="email" required />
      <TextField
        variant="line"
        label="Contact number"
        name="phoneNumber"
        type="tel"
        autoComplete="tel"
        placeholder="+91"
        className="md:col-span-2"
      />
      <TextArea
        variant="line"
        label="Message — tell us about your date, idea or project"
        name="message"
        required
        className="md:col-span-2"
      />

      <Button
        type="submit"
        variant="paper"
        size="lg"
        loading={loading}
        className="justify-self-start px-14 md:col-span-2 md:justify-self-end"
      >
        <em className="text-flourish">Send your</em> ENQUIRY
      </Button>
    </form>
  );
}
