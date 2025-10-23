export const generateVariantStyle = (theme = () => {}, toRGB = () => {}) => ({
  // 🌴 1. Ocean Breeze
  '.card-variant-ocean-breeze': {
    '& .card-photo-gradient': {
      '@apply from-primary-cyan to-primary-blue': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-cyan': {},
    },
    '& button': {
      '@apply bg-primary-cyan hover:bg-cyan-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.cyan'))}/0.3) !important`,
    },
  },
  // 🍍 2. Pineapple Punch
  '.card-variant-pineapple-punch': {
    '& .card-photo-gradient': {
      '@apply from-primary-lime to-primary-yellow': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-lime': {},
    },
    '& button': {
      '@apply bg-primary-lime hover:bg-lime-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.yellow'))}/0.4) !important`,
    },
  },
  // 🌺 3. Sunset Coral
  '.card-variant-sunset-coral': {
    '& .card-photo-gradient': {
      '@apply from-primary-orange to-primary-pink': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-orange': {},
    },
    '& button': {
      '@apply bg-primary-orange hover:bg-orange-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.orange'))}/0.3) !important`,
    },
  },
  // 🍉 4. Watermelon Wave
  '.card-variant-watermelon-wave': {
    '& .card-photo-gradient': {
      '@apply from-primary-green to-primary-rose': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-rose': {},
    },
    '& button': {
      '@apply bg-primary-rose hover:bg-rose-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.rose'))}/0.3) !important`,
    },
  },
  // 🌿 5. Jungle Mint
  '.card-variant-jungle-mint': {
    '& .card-photo-gradient': {
      '@apply from-primary-teal to-primary-emerald': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-teal': {},
    },
    '& button': {
      '@apply bg-primary-teal hover:bg-teal-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.emerald'))}/0.3) !important`,
    },
  },
  // 🌞 6. Golden Hour
  '.card-variant-golden-hour': {
    '& .card-photo-gradient': {
      '@apply from-primary-orange to-primary-amber': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-amber': {},
    },
    '& button': {
      '@apply bg-primary-amber hover:bg-amber-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.amber'))}/0.3) !important`,
    },
  },
  // 🪸 7. Coral Reef
  '.card-variant-coral-reef': {
    '& .card-photo-gradient': {
      '@apply from-primary-rose to-primary-orange': {},
    },
    '& h3, & .name-initials': {
      '@apply text-rose-700': {},
    },
    '& button': {
      '@apply bg-rose-700 hover:bg-rose-800': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.rose'))}/0.3) !important`,
    },
  },
  // 🍊 8. Mango Splash
  '.card-variant-mango-splash': {
    '& .card-photo-gradient': {
      '@apply from-primary-yellow to-primary-orange': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-yellow': {},
    },
    '& button': {
      '@apply bg-primary-yellow hover:bg-yellow-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.amber'))}/0.3) !important`,
    },
  },
  // 🐚 9. Lagoon Mist
  '.card-variant-lagoon-mist': {
    '& .card-photo-gradient': {
      '@apply from-sky-700 to-teal-700': {},
    },
    '& h3, & .name-initials': {
      '@apply text-sky-700': {},
    },
    '& button': {
      '@apply bg-sky-700 hover:bg-sky-800': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.sky'))}/0.3) !important`,
    },
  },
  // 🥥 10. Coconut Cream
  '.card-variant-coconut-cream': {
    '& .card-photo-gradient': {
      '@apply from-primary-stone to-primary-amber': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-slate': {},
    },
    '& button': {
      '@apply bg-primary-slate hover:bg-slate-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.slate'))}/0.4) !important`,
    },
  },
  // 🌈 11. Paradise Mix
  '.card-variant-paradise-mix': {
    '& .card-photo-gradient': {
      '@apply from-primary-purple to-primary-pink': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-purple': {},
    },
    '& button': {
      '@apply bg-primary-purple hover:bg-purple-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.pink'))}/0.3) !important`,
    },
  },
  // 🌵 12. Palm Grove
  '.card-variant-palm-grove': {
    '& .card-photo-gradient': {
      '@apply from-primary-lime to-primary-emerald': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-lime': {},
    },
    '& button': {
      '@apply bg-primary-lime hover:bg-lime-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.lime'))}/0.3) !important`,
    },
  },
  // 🍓 13. Berry Sunrise
  '.card-variant-berry-sunrise': {
    '& .card-photo-gradient': {
      '@apply from-primary-rose to-primary-fuchsia': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-fuchsia': {},
    },
    '& button': {
      '@apply bg-primary-fuchsia hover:bg-fuchsia-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.fuchsia'))}/0.3) !important`,
    },
  },
  // 🪶 14. Aqua Feather
  '.card-variant-aqua-feather': {
    '& .card-photo-gradient': {
      '@apply from-primary-blue to-primary-cyan': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-blue': {},
    },
    '& button': {
      '@apply bg-primary-blue hover:bg-blue-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.cyan'))}/0.3) !important`,
    },
  },
  // 🌋 15. Volcanic Glow
  '.card-variant-volcanic-glow': {
    '& .card-photo-gradient': {
      '@apply from-red-700 to-rose-900': {},
    },
    '& h3, & .name-initials': {
      '@apply text-red-800': {},
    },
    '& button': {
      '@apply bg-red-800 hover:bg-red-900': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.red'))}/0.4) !important`,
    },
  },
  // 🪴 16. Tropical Sage
  '.card-variant-tropical-sage': {
    '& .card-photo-gradient': {
      '@apply from-primary-green to-primary-lime': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-green': {},
    },
    '& button': {
      '@apply bg-primary-green hover:bg-green-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.emerald'))}/0.2) !important`,
    },
  },
  '.card-variant-papaya-glow': {
    '& .card-photo-gradient': {
      '@apply from-primary-orange to-primary-pink': {},
    },
    '& h3, & .name-initials': {
      '@apply text-primary-orange': {},
    },
    '& button': {
      '@apply bg-primary-orange hover:bg-orange-700': {},
    },
    '&:hover': {
      boxShadow: `0 8px 20px rgb(${toRGB(theme('colors.primary.pink'))}/0.3) !important`,
    },
  },
})
