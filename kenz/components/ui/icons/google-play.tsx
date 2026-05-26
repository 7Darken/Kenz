import type { SVGProps } from 'react'

type GooglePlayIconProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export function GooglePlayIcon({ size = 18, ...props }: GooglePlayIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3.61 1.81C3.24 2.2 3.02 2.81 3.02 3.6v16.8c0 .79.22 1.4.59 1.79l.06.05L13.06 12l-9.39-10.24-.06.05Z"
        fill="#00D7FE"
      />
      <path
        d="M16.18 15.13 13.06 12l3.13-3.13.07.04 3.7 2.1c1.06.6 1.06 1.58 0 2.18l-3.7 2.1-.08.04Z"
        fill="#FFCE00"
      />
      <path
        d="M16.26 15.18 13.06 12 3.61 21.97c.35.37.93.42 1.58.05l11.06-6.84Z"
        fill="#FF3946"
      />
      <path
        d="M16.26 8.82 5.19 1.98c-.65-.37-1.23-.32-1.58.05L13.06 12l3.2-3.18Z"
        fill="#00F076"
      />
    </svg>
  )
}
