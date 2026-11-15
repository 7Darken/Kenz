/**
 * Le podium : trois blocs en vraie perspective (dessus et côté éclairés, ombre au sol), le 1 en or avec le nom
 * du projet. Il tourne légèrement au pointeur (géré par la séquence, à la souris seulement).
 */
import type { ReactNode } from "react";

import styles from "./victoire.module.css";

const BLOCK_CLASS = { 1: styles.blk1, 2: styles.blk2, 3: styles.blk3 } as const;

function Block({ rank, children }: { rank: 1 | 2 | 3; children: ReactNode }) {
  return (
    <div className={`${styles.blk} ${BLOCK_CLASS[rank]}`}>
      <div className={styles.blkIn} data-kv={`block-${rank}`}>
        <i className={`${styles.face3} ${styles.top}`}>{rank === 1 ? <b className={styles.glint} data-kv="glint" /> : null}</i>
        <i className={`${styles.face3} ${styles.side}`} />
        <span className={`${styles.face3} ${styles.front}`}>{children}</span>
      </div>
    </div>
  );
}

export function Podium({ project, label }: { project: string; label: string }) {
  return (
    <div className={styles.pod} role="img" aria-label={label} data-kv="pod">
      <div className={styles.p3} data-kv="p3">
        <i className={styles.floor} data-kv="floor" />
        <Block rank={2}>
          <b className={styles.rank}>2</b>
        </Block>
        <Block rank={1}>
          <b className={`${styles.rank} ${styles.rank1}`}>1</b>
          <span className={styles.blkName}>{project}</span>
        </Block>
        <Block rank={3}>
          <b className={styles.rank}>3</b>
        </Block>
      </div>
    </div>
  );
}
