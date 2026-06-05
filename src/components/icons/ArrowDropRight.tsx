interface Props {
  className?: string
  size?: number
}

export function ArrowDropRight({ className, size = 20 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
      <path d="M14 12L10 16V8L14 12Z" />
    </svg>
  )
}
