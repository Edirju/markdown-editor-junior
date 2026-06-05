interface Props {
  className?: string
  size?: number
}

export function H4({ className, size = 20 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
      <path d="M4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 17.5V15.5H22V17.5H18.5ZM22 11.5H18.5V8H16.5V13H22V17.5H16.5V19H14.5V4H16.5V11.5H22Z" />
    </svg>
  )
}
