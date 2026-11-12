/** "from your first *hairline*" → the text with the starred words in the serif italic */
export default function WithFlourish({ text, className }: { text: string; className?: string }) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 ? (
      <em key={i} className={className ? `text-flourish ${className}` : "text-flourish"}>
        {part}
      </em>
    ) : (
      part
    ),
  );
}
