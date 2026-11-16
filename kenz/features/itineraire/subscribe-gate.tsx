"use client";

/**
 * La porte « abonnés », sur l'honneur : YouTube ne permet pas de vérifier un abonnement sans faire se connecter le
 * visiteur. On demande ; « Pas encore » ouvre la chaîne dans un nouvel onglet (sa fenêtre « S'abonner ? ») ; au
 * retour sur la page, on propose de valider. Valider : les confettis, puis la page s'ouvre. Rien n'est envoyé nulle
 * part : la réponse reste sur l'appareil (localStorage `kenz-yt-subscriber`, commun à tous les itinéraires).
 * Le serveur rend la page entière (indexable) ; la porte n'apparaît qu'après l'hydratation, et jamais pour un
 * abonné qui revient. C'est un dialogue modal : le reste de la page est inerte, le défilement bloqué ; Échap ne la
 * ferme pas (elle s'ouvre en validant, ou on repart par « Retour au site »).
 */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { Itinerary } from "@/content/itineraries";
import { ROUTES } from "@/content/site";
import type { ImageAsset } from "@/content/types";
import { Button } from "@/design-system/components/button";
import { Dialog, type DialogCloseReason } from "@/design-system/components/dialog";
import { Icon } from "@/design-system/components/icon";
import { LanguageToggle } from "@/design-system/components/language-toggle";
import { SocialIcon } from "@/design-system/components/social-icon";
import { ThemeToggle } from "@/design-system/components/theme-toggle";
import { useGsap } from "@/design-system/motion/use-gsap";
import { useQuality } from "@/design-system/motion/use-quality";
import { useReducedMotion } from "@/design-system/motion/use-reduced-motion";
import { useLanguage } from "@/i18n/language-provider";
import { burst } from "./confetti";
import { TripIcon } from "./icons";
import styles from "./subscribe-gate.module.css";
import { channelHandle, subscribeUrl, tripStats } from "./trip";
import { useSubscriber } from "./use-stored-state";

type Step = "ask" | "waiting" | "back" | "success";

/** Le temps de la barre « Accès débloqué » avant que la page s'ouvre (ms). */
const UNLOCK_DELAY_MS = 1700;
const CONFETTI = { high: 60, medium: 36, low: 18 } as const;

interface SubscribeGateProps {
  itinerary: Itinerary;
  /** L'adresse de la chaîne YouTube. */
  channel: string;
  portrait: ImageAsset;
}

export function SubscribeGate({ itinerary, channel, portrait }: SubscribeGateProps) {
  const { t } = useLanguage();
  const s = t.itineraire.gate;
  const { locked, unlock } = useSubscriber();
  const [step, setStep] = useState<Step>("ask");
  /** Le navigateur a fermé le dialogue de lui-même (geste « retour ») : on le remonte. */
  const [round, setRound] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const stats = tripStats(itinerary);
  const subscribe = subscribeUrl(channel);
  const success = step === "success";

  // À l'ouverture et à chaque étape, le focus va au titre (après celui que pose le dialogue sur son premier lien) :
  // les lecteurs d'écran lisent la question, et aucun anneau de focus ne s'allume sur « Retour au site ».
  useEffect(() => {
    if (locked) titleRef.current?.focus({ preventScroll: true });
  }, [locked, step, round]);

  // YouTube ouvert dans un autre onglet : on attend le retour du visiteur sur la page.
  useEffect(() => {
    if (step !== "waiting") return;
    let left = document.visibilityState === "hidden" || !document.hasFocus();
    const onLeave = () => {
      left = true;
    };
    const onReturn = () => {
      if (left && document.visibilityState === "visible") setStep("back");
    };
    const onVisibility = () => (document.visibilityState === "hidden" ? onLeave() : onReturn());
    window.addEventListener("blur", onLeave);
    window.addEventListener("focus", onReturn);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("focus", onReturn);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [step]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(unlock, UNLOCK_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [success, unlock]);

  // Les confettis (hors mouvement réduit), moins nombreux sur les appareils modestes.
  useGsap(
    () => {
      const host = bodyRef.current;
      if (!success || reduced || !host) return;
      return burst(host, [...itinerary.cities.map((city) => city.color), "#F4EFE6"], CONFETTI[quality]);
    },
    bodyRef,
    [success],
  );

  // Seul le navigateur ferme la porte (geste « retour ») : on la remonte. Un événement de fermeture en retard, quand
  // le dialogue est déjà rouvert (effets rejoués en développement), ne compte pas.
  const onClose = (reason: DialogCloseReason) => {
    if (reason === "browser" && !bodyRef.current?.closest("dialog")?.open) setRound((value) => value + 1);
  };
  const confirm = () => setStep("success");
  const openYouTube = () => setStep("waiting");

  return (
    <Dialog key={round} open={locked} onClose={onClose} labelledBy="gate-title" closeButton={false} className={styles.gate}>
      <div className={styles.top}>
        <Link className={styles.back} href={ROUTES.createur}>
          <Icon name="arrow-left" />
          {s.back}
        </Link>
        <div className={styles.toggles}>
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>

      <div ref={bodyRef} className={styles.body}>
        <div className={styles.avatar} data-success={success ? "" : undefined}>
          <span className={styles.ring} aria-hidden="true" />
          <span className={styles.photo}>
            <Image src={portrait.src} alt="" width={88} height={88} sizes="88px" />
          </span>
          <span key={success ? "done" : "youtube"} className={styles.badge} aria-hidden="true">
            {success ? <TripIcon name="check" strokeWidth={3} className={styles.drawn} /> : <SocialIcon network="youtube" />}
          </span>
        </div>
        <p className={styles.handle}>{channelHandle(channel)}</p>

        {step === "waiting" || step === "back" ? (
          <ol className={styles.steps} aria-hidden="true">
            {s.steps.map((label, index) => {
              const current = step === "waiting" ? 1 : 2;
              return (
                <li key={label} data-state={index < current ? "done" : index === current ? "current" : undefined}>
                  <span className={styles.stepDot}>
                    {index < current ? <TripIcon name="check" strokeWidth={3} /> : index + 1}
                  </span>
                  {label}
                </li>
              );
            })}
          </ol>
        ) : null}

        <div key={step} className={styles.step}>
          {step === "waiting" ? (
            <span className={styles.radar} aria-hidden="true">
              <span />
              <span />
              <span />
              <SocialIcon network="youtube" />
            </span>
          ) : null}
          <h2 id="gate-title" ref={titleRef} tabIndex={-1} className={styles.title}>
            {step === "ask" ? s.title : step === "waiting" ? s.waitingTitle : step === "back" ? s.backTitle : s.successTitle}
          </h2>
          <p className={styles.text}>
            {step === "ask" ? s.text : step === "waiting" ? s.waitingText : step === "back" ? s.backText : s.successText}
          </p>

          {step === "ask" ? (
            <>
              <div className={styles.actions}>
                <Button icon={null} onClick={confirm}>
                  {s.yes}
                </Button>
                <Button href={subscribe} external variant="accent" onClick={openYouTube}>
                  {s.subscribe}
                </Button>
              </div>
              <p className={styles.perks}>
                {stats.days} {s.perks.days} · {stats.activities} {s.perks.activities} · {s.perks.calendar}
              </p>
            </>
          ) : null}

          {step === "waiting" ? (
            <div className={styles.actions}>
              <Button icon={null} onClick={confirm}>
                {s.done}
              </Button>
              <Button href={subscribe} external variant="ghost">
                {s.reopen}
              </Button>
            </div>
          ) : null}

          {step === "back" ? (
            <div className={styles.actions}>
              <Button variant="accent" icon={null} onClick={confirm}>
                {s.unlock}
              </Button>
              <Button href={subscribe} external variant="ghost" onClick={openYouTube}>
                {s.notYet}
              </Button>
            </div>
          ) : null}

          {success ? (
            <span className={styles.progress} style={{ "--unlock": `${UNLOCK_DELAY_MS}ms` } as CSSProperties} aria-hidden="true">
              <span />
            </span>
          ) : null}
        </div>
      </div>
    </Dialog>
  );
}
