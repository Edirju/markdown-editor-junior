interface Props {
  className?: string
  size?: number
}

export function H5({ className, size = 20 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
      <path d="M4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 8C20.5714 8 22.25 9.42857 22.25 11.5C22.25 12.5217 21.8645 13.4535 21.2349 14.1528L21.2492 14.1478L18.5 17.2V17.5H22V19H16V16.3L19.4772 12.6295C19.8626 12.1652 20.05 11.5913 20.05 11C20.05 9.92083 19.1292 9.05 18.05 9.05C16.9708 9.05 16.05 9.92083 16.05 11H14.35C14.35 8.92857 16.0286 8 18.05 8H18.5Z" />
    </svg>
  )
}
