import { siteConfig } from "@/config/site";

/** Centred careers note pointing to the opportunities inbox */
export default function JoinTeam() {
  const { careersEmail } = siteConfig.contact;
  if (!careersEmail) return null;

  return (
    <section aria-labelledby="join-team" className="section container text-center">
      <h2 id="join-team" data-heading-effect className="text-title-xl">
        Looking to join <em className="text-flourish text-accent-soft">our team?</em>
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-body text-muted">
        We&apos;re always on the lookout for passionate, creative people to grow with us. Write to us at{" "}
        <a
          href={`mailto:${careersEmail}`}
          className="text-accent underline underline-offset-4 transition-colors hover:text-ink"
        >
          {careersEmail}
        </a>{" "}
        with your portfolio and a short note about yourself.
      </p>
    </section>
  );
}
