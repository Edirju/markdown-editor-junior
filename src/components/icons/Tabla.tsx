interface Props {
  className?: string
  size?: number
}

export function Tabla({ className, size = 20 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
      <path d="M20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20ZM19 5H5V19H19V5ZM7 9H9V15H7V9ZM11 9H13V15H11V9ZM15 9H17V15H15V9Z" />
    </svg>
  )
}
