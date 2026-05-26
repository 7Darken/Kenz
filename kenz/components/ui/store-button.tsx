'use client'

import Image from 'next/image'
import styled, { css } from 'styled-components'
import { motion, type HTMLMotionProps } from 'framer-motion'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

import { GooglePlayIcon } from './icons/google-play'

type Store = 'apple' | 'google'
type Size = 'sm' | 'md' | 'lg'

type StoreButtonBaseProps = {
  store: Store
  href: string
  label?: ReactNode
  size?: Size
  glow?: string
  trailing?: ReactNode
}

type StaticAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>

type MotionAnchorProps = Omit<HTMLMotionProps<'a'>, 'href'>

export type StoreButtonProps =
  | (StoreButtonBaseProps & { animated?: false } & StaticAnchorProps)
  | (StoreButtonBaseProps & { animated: true } & MotionAnchorProps)

const STORE_DEFAULTS: Record<Store, { label: string; alt: string }> = {
  apple: { label: 'Télécharger', alt: 'App Store' },
  google: { label: 'Disponible sur', alt: 'Google Play' },
}

const sizeStyles = {
  sm: css`
    padding: 0.55rem 1.1rem;
    font-size: 0.82rem;
    gap: 0.5rem;
  `,
  md: css`
    padding: 0.85rem 1.4rem;
    font-size: 0.9rem;
    gap: 0.7rem;
  `,
  lg: css`
    padding: 1rem 1.8rem;
    font-size: 1rem;
    gap: 0.85rem;
  `,
}

const iconSizes: Record<Size, number> = { sm: 16, md: 18, lg: 20 }

const Anchor = styled.a<{ $size: Size; $glow?: string }>`
  display: inline-flex;
  align-items: center;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition: background 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  ${p => sizeStyles[p.$size]}

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${p => (p.$glow ? `${p.$glow}60` : 'rgba(255, 255, 255, 0.2)')};
    box-shadow: ${p => (p.$glow ? `0 0 30px ${p.$glow}20` : 'none')};
    transform: translateY(-2px);
  }
`

const MotionAnchor = motion(Anchor)

const Label = styled.span`
  display: inline-flex;
  align-items: baseline;
  white-space: nowrap;
`

function renderContent(store: Store, size: Size, label: ReactNode | undefined, trailing: ReactNode) {
  const defaults = STORE_DEFAULTS[store]
  const iconSize = iconSizes[size]
  return (
    <>
      {store === 'apple' ? (
        <Image
          src="/images/icons/Apple_logo_white.webp"
          alt={defaults.alt}
          width={iconSize}
          height={iconSize}
        />
      ) : (
        <GooglePlayIcon size={iconSize} />
      )}
      <Label>{label ?? defaults.label}</Label>
      {trailing}
    </>
  )
}

export function StoreButton(props: StoreButtonProps) {
  if (props.animated) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      animated,
      store,
      href,
      label,
      size = 'md',
      glow,
      trailing,
      target = '_blank',
      rel = 'noopener noreferrer',
      ...rest
    } = props
    return (
      <MotionAnchor href={href} target={target} rel={rel} $size={size} $glow={glow} {...rest}>
        {renderContent(store, size, label, trailing)}
      </MotionAnchor>
    )
  }

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    animated,
    store,
    href,
    label,
    size = 'md',
    glow,
    trailing,
    target = '_blank',
    rel = 'noopener noreferrer',
    ...rest
  } = props
  return (
    <Anchor href={href} target={target} rel={rel} $size={size} $glow={glow} {...rest}>
      {renderContent(store, size, label, trailing)}
    </Anchor>
  )
}
