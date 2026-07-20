import { FiGithub, FiLinkedin, FiTwitter, FiGlobe, FiArrowUp } from 'react-icons/fi'
import { useContent } from '../../hooks/useContent'

const socialIconMap = {
  github: FiGithub,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  portfolio: FiGlobe,
}

const socialLabels = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  portfolio: 'Portfolio',
}

export default function Footer() {
  const { content } = useContent()
  const settings = content.settings || {}
  const social = settings.social || {}
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center gap-6">
          <h3 className="text-xl font-bold">{settings.name || 'Portfolio'}</h3>

          <div className="flex gap-4">
            {Object.entries(social).map(([key, url]) => {
              const Icon = socialIconMap[key] || FiGlobe
              const label = socialLabels[key] || key
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary/50 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} {settings.name || 'Portfolio'}. All rights reserved.
          </p>

          <div className="flex gap-3 items-center">
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <FiArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
