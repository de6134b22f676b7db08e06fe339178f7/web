"use client";
/**
 * Global sport switch (M24). Two contexts so the roller's 2.3 s tick only re-renders the hero:
 * - KitCtx: the chosen sport for the whole kit ("any" = generic, the default), set from sport rows, kit chips
 *   and the Next up card. Announced politely ("Kit now showing netball").
 * - HeroCtx: the sport the hero roller is currently showing (the Next up card follows it).
 * `bump` increments on every kit change so plates can play the plate-wide crossfade.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { SportId } from "@/content/sample";
import { sportName } from "./data";

type KitCtxT = { sport: SportId; bump: number; setSport: (s: SportId) => void };
type HeroCtxT = { shown: SportId; setShown: (s: SportId) => void };

const KitCtx = createContext<KitCtxT>({ sport: "any", bump: 0, setSport: () => {} });
const HeroCtx = createContext<HeroCtxT>({ shown: "any", setShown: () => {} });

export const useKit = () => useContext(KitCtx);
export const useHero = () => useContext(HeroCtx);

export function SportProvider({ children }: { children: ReactNode }) {
  const [kit, setKit] = useState<{ sport: SportId; bump: number }>({ sport: "any", bump: 0 });
  const [shown, setShown] = useState<SportId>("any");
  const [msg, setMsg] = useState("");
  const setSport = useCallback((s: SportId) => {
    setKit((k) => (k.sport === s ? k : { sport: s, bump: k.bump + 1 }));
    setShown(s);
    setMsg(`Kit now showing ${sportName(s)}`);
  }, []);
  const kitValue = useMemo(() => ({ ...kit, setSport }), [kit, setSport]);
  const heroValue = useMemo(() => ({ shown, setShown }), [shown]);
  return (
    <KitCtx.Provider value={kitValue}>
      <HeroCtx.Provider value={heroValue}>
        {children}
        <p className="sr" aria-live="polite">
          {msg}
        </p>
      </HeroCtx.Provider>
    </KitCtx.Provider>
  );
}
