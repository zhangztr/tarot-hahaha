import { useEffect, useRef } from "react";

// Track the DOM node rather than the effect, which StrictMode may replay.
const attemptedSlots = new WeakSet<HTMLElement>();
const POLL_INTERVAL_MS = 200;
const MAX_WAIT_MS = 10000;

type AdsWindow = Window & {
  adsbygoogle?: { push: (request: Record<string, never>) => unknown };
};

export default function AdSlot() {
  const slotRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const tryPush = () => {
      if (!slot.isConnected || attemptedSlots.has(slot) || slot.hasAttribute("data-adsbygoogle-status")) {
        return true;
      }

      const ads = (window as AdsWindow).adsbygoogle;
      if (!ads) return false;

      // An exception can follow partial ad initialization; never retry this node.
      attemptedSlots.add(slot);
      try {
        ads.push({});
      } catch (error) {
        console.warn("Ad initialization failed; the reading remains available.", error);
      }
      return true;
    };

    if (tryPush()) return;

    let elapsed = 0;
    const timer = window.setInterval(() => {
      elapsed += POLL_INTERVAL_MS;
      if (tryPush() || elapsed >= MAX_WAIT_MS) window.clearInterval(timer);
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <ins
      ref={slotRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-2039279198322464"
      data-ad-slot="1234567890"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
