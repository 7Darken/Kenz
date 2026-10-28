"use client";

import { useCallback, useEffect, useMemo } from "react";
import { notFound } from "next/navigation";
import styled from "styled-components";
import { AnimatePresence, MotionConfig } from "framer-motion";

import { getItinerary, getTripStats } from "@/data/itineraries";
import { useHydrated, useStoredState } from "@/lib/browser-state";
import { YOUTUBE_CHANNEL_URL } from "@/lib/socials";
import { Essentials } from "./essentials";
import { ItineraryHero } from "./itinerary-hero";
import { PLANNER_ID, Planner, readHashDay } from "./planner";
import { tokens } from "./shared";
import { SubscribeGate } from "./subscribe-gate";
import { VideoSection } from "./video-section";

/** Shared by every itinerary: subscribing once unlocks them all. */
const SUBSCRIBER_KEY = "kenz-yt-subscriber";

export function ItineraryView({ slug }: { slug: string }) {
  const itinerary = getItinerary(slug);
  if (!itinerary) notFound();

  const hydrated = useHydrated();
  const [subscriber, setSubscriber] = useStoredState(SUBSCRIBER_KEY);
  // Server render and hydration show the page itself (indexable, no flash
  // for returning subscribers); the gate fades in right after if needed.
  const locked = hydrated && subscriber !== "1";

  const stats = useMemo(() => getTripStats(itinerary), [itinerary]);
  const confettiColors = useMemo(
    () => [...itinerary.cities.map((city) => city.color), tokens.youtube, "#ffffff"],
    [itinerary],
  );
  const unlock = useCallback(() => setSubscriber("1"), [setSubscriber]);
  const videoUrl = itinerary.youtubeVideoId
    ? `https://www.youtube.com/watch?v=${itinerary.youtubeVideoId}`
    : `${YOUTUBE_CHANNEL_URL}/videos`;

  const scrollToPlanner = useCallback(() => {
    document.getElementById(PLANNER_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Deep link (#jour-5): once the page is unlocked, jump straight to the planner.
  // Deferred so it lands after the site-wide scroll reset on navigation.
  useEffect(() => {
    if (!hydrated || locked || readHashDay() === null) return;
    const timer = window.setTimeout(() => {
      document.getElementById(PLANNER_ID)?.scrollIntoView({ block: "start" });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [hydrated, locked]);

  return (
    <MotionConfig reducedMotion="user">
      <Page>
        <Grain aria-hidden />
        <Content inert={locked}>
          <ItineraryHero itinerary={itinerary} videoUrl={videoUrl} onExplore={scrollToPlanner} />
          <Planner itinerary={itinerary} active={!locked} />
          <Essentials itinerary={itinerary} />
          <VideoSection itinerary={itinerary} videoUrl={videoUrl} />
        </Content>

        <AnimatePresence>
          {locked && (
            <SubscribeGate
              key="subscribe-gate"
              stats={{ days: stats.days, activities: stats.activities }}
              colors={confettiColors}
              onUnlock={unlock}
            />
          )}
        </AnimatePresence>
      </Page>
    </MotionConfig>
  );
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */

const Page = styled.main`
  position: relative;
  min-height: 100vh;
  background: #030305;
  color: ${tokens.text};
  overflow-x: clip;
`;

/* Film grain over the whole page: a tiny inline SVG noise, no request. */
const Grain = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
`;

const Content = styled.div`
  position: relative;
`;
