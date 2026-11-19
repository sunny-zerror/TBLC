"use client";

import { useState } from "react";
import { tabPanelProps, Tabs } from "@/components/ui/Tabs";
import type { Service } from "@/data/expertise";

type TabId = "story" | "design" | "offer";

const TABS: { id: TabId; label: string }[] = [
  { id: "story", label: "The story" },
  { id: "design", label: "The design" },
  { id: "offer", label: "What we offer" },
];

const bullet = "flex gap-2 before:content-['·']";

/** "The story / The design / What we offer" on a service page */
export default function ServiceTabs({ service }: { service: Service }) {
  const [active, setActive] = useState<TabId>("story");

  return (
    <div>
      <Tabs tabs={TABS} active={active} onChange={setActive} label={`About ${service.title}`} />
      <div {...tabPanelProps(active)} className="mt-6 text-body text-ink-soft outline-none">
        {active === "offer" ? (
          <ul className="flex flex-col gap-1">
            {service.offer.map((item) => (
              <li key={item} className={bullet}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-4">
            {service[active].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
