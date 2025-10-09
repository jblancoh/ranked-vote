import { Heart, Github, Twitter, Mail, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    project: [
      { name: 'Inicio', path: '/' },
      { name: 'Acerca de', path: '/about' },
      { name: 'Votar', path: '/vote' },
      { name: 'Resultados', path: '/results' },
    ],
    legal: [
      { name: 'Privacidad', path: '/privacy' },
      { name: 'Términos de Uso', path: '/terms' },
      { name: 'Código de Conducta', href: 'https://github.com/dev-night-talk/vota-flor/blob/main/CODE_OF_CONDUCT.md', external: true },
    ],
    community: [
      { name: 'Contribuir', href: 'https://github.com/dev-night-talk/vota-flor/blob/main/CONTRIBUTING.md', external: true },
      { name: 'Issues', href: 'https://github.com/dev-night-talk/vota-flor/issues', external: true },
      { name: 'Hacktoberfest', href: 'https://hacktoberfest.com', external: true },
    ],
  }

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/dev-night-talk/vota-flor',
      color: 'hover:text-gray-900'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/devnighttalkvh',
      color: 'hover:text-blue-500'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:jblancoh26@gmail.com',
      color: 'hover:text-red-500'
    },
  ]

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container-custom py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🗳️</span>
              <div>
                <h3 className="text-lg font-display font-bold text-gradient">
                  Ranked Vote
                </h3>
                <p className="text-xs text-gray-500">Tabasco 2026</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Sistema de votación comunitaria para eventos culturales.
              Celebrando la tradición del Certamen Flor de Tabasco.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-gray-100 text-gray-600 ${social.color} transition-colors duration-200`}
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Project Links */}
          <div>
            <h4 className="text-sm font-display font-bold text-gray-900 mb-4">
              Proyecto
            </h4>
            <ul className="space-y-2">
              {footerLinks.project.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-display font-bold text-gray-900 mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200 inline-flex items-center"
                    >
                      {link.name}
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="text-sm font-display font-bold text-gray-900 mb-4">
              Comunidad
            </h4>
            <ul className="space-y-2 mb-4">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200 inline-flex items-center"
                  >
                    {link.name}
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Hacktoberfest Badge */}
            <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              🎃 Hacktoberfest 2025
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-600 text-center md:text-left">
              <p className="flex items-center justify-center md:justify-start flex-wrap">
                © {currentYear} Ranked Vote. Creado con{' '}
                <Heart size={14} className="mx-1 text-red-500 fill-current animate-pulse" />
                {' '}por{' '}
                <a
                  href="https://devnighttalk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Dev Night Talk Villahermosa
                </a>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Proyecto Open Source bajo licencia MIT
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded">
                #Hacktoberfest
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded">
                #DevNightTalkVhsa
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded">
                #OpenSource
              </span>
            </div>
          </div>
        </div>

        {/* Made with love message */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Hecho en Villahermosa, Tabasco 🌴 México
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer