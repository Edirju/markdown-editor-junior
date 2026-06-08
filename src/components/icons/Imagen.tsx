interface Props {
  className?: string
  size?: number
}

export function Imagen({ className, size = 20 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
      <path d="M15 3H21V9L19 7.5L15 12L12 9L9 12L9.00104 20.9995L3 21V3H15ZM17.6569 8.65685L19 7.5V5H5V19H7.99922L12.0004 13.9995L15.0004 16.9995L17.6569 14.3431ZM6.5 7C7.32843 7 8 7.67157 8 8.5C8 9.32843 7.32843 10 6.5 10C5.67157 10 5 9.32843 5 8.5C5 7.67157 5.67157 7 6.5 7Z" />
    </svg>
  )
}
