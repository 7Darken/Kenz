"use client";

/** La ligne « série » d'une escale : le texte localisé, le nom de la série en gras à la place de `{series}`. */
import { Fragment } from "react";

import { SERIES_NAME_TOKEN, type SeriesLine as SeriesLineData } from "@/content/series";
import { useText } from "@/i18n/text";

export function SeriesLine({ line }: { line: SeriesLineData }) {
  const parts = useText(line.text).split(SERIES_NAME_TOKEN);
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 ? <b>{line.seriesName}</b> : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}
