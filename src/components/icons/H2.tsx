interface Props {
  className?: string
  size?: number
}

export function H2({ className, size = 20 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size}>
      <path d="M4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 8C20.43 8 22 9.57 22 11.5C22 12.7638 21.3699 13.8775 20.4003 14.561L20.3997 14.5607L18.8286 16H22V18H15V16.54L17.6665 14.0802C18.4825 13.4727 19 12.5378 19 11.5C19 10.1193 17.8807 9 16.5 9C15.1193 9 14 10.1193 14 11.5H12C12 8.46243 14.4624 6 17.5 6C18.5956 6 19.6032 6.34223 20.4249 6.91064L19.2551 8.32163C18.7392 7.92875 18.1042 7.69053 17.4128 7.65635L17.5 8Z" />
    </svg>
  )
}
