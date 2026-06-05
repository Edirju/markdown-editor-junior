interface Props {
  className?: string
  size?: number
}

export function TextoCuerpo({ className, size = 20 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
      <path d="M13 6V21H11V6H5V4H19V6H13Z" />
    </svg>
  )
}
