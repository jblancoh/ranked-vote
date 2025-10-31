export const getInitials = (name) => {
  if (!name) {
    return ''
  }

  const words = name.split(' ')
  const initials = words
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()

  return initials
}
