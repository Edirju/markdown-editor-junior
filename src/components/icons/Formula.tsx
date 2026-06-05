interface Props {
  className?: string
  size?: number
}

export function Formula({ className, size = 20 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
      <path d="M5 18L12.6796 12L5 6V4H19V6H8.26348L16 12L8.26348 18H19V20H5V18Z" />
    </svg>
  )
}
