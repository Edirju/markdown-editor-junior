interface Props {
  className?: string
  size?: number
}

export function ArrowDropDown({ className, size = 20 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
      <path d="M12 14L8 10H16L12 14Z" />
    </svg>
  )
}
