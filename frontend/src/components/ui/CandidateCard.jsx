import { tv } from 'tailwind-variants'
import { getInitials, cn } from '../../utils'

const card = tv({
  slots: {
    base: 'group bg-white/50 dark:bg-card-dark/60 backdrop-blur-sm rounded-xl p-6 transform transition-all duration-300 border border-gray-200 dark:border-gray-700/50',
    image: 'w-full bg-cover bg-no-repeat bg-center object-cover',
    initials: 'name-initials absolute inset-0 flex items-center justify-center text-3xl font-bold',
    footer: 'flex justify-end',
  },
  variants: {
    hoverable: {
      true: 'hover:scale-105 hover:shadow-2xl dark:hover:shadow-accent-purple/20',
    },
    rounded: {
      true: {
        image: 'rounded-full',
      },
    },
    borderless: {
      true: {
        base: 'border-none shadow',
      },
    },
    elavated: {
      true: {
        base: 'shadow',
      },
    },
    padding: {
      sm: {
        base: 'p-2 sm:p-3',
      },
      md: {
        base: 'p-4 sm:p-6',
      },
      xl: {
        base: 'p-8 sm:p-12',
      },
    },
  },
})

export const CandidateCard = ({
  hoverable = false,
  borderless = false,
  elavated = false,
  padding = 'md',
  children,
  className,
}) => {
  const { base } = card({ hoverable, borderless, elavated, padding })

  return <div className={cn(base(), className)}>{children}</div>
}

export const CardImage = ({ src, alt, rounded = false, className, ...rest }) => {
  const { image, initials } = card({ rounded })

  if (!src) {
    return (
      <p className={cn(initials())} {...rest}>
        {getInitials(alt)}
      </p>
    )
  }

  return <img className={cn(image(), className)} src={src} alt={alt} {...rest} />
}

export const CardContent = ({ children, className }) => {
  return <div className={cn(className)}>{children}</div>
}

export const CardFooter = ({ children, className }) => {
  const { footer } = card()
  return <div className={cn(footer(), className)}>{children}</div>
}
