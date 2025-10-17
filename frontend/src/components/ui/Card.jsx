/**
 * Card Component
 * Tarjeta reutilizable con diferentes variantes
 */
const Card = ({
  children,
  variant = 'default',
  interactive = false,
  padding = 'md',
  className = '',
  onClick,
}) => {
  const baseClasses = 'card'

  const variants = {
    default: '',
    elevated: 'shadow-xl',
    bordered: 'border-2 border-gray-200',
    glass: 'glass',
  }

  const paddings = {
    none: '',
    sm: 'p-2 sm:p-3',
    md: 'p-4 sm:p-6',
    xl: 'p-8 sm:p-12',
  }

  const interactiveClass = interactive ? 'card-interactive' : ''
  const clickableClass = onClick ? 'cursor-pointer' : ''

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${paddings[padding]} ${interactiveClass} ${clickableClass} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
