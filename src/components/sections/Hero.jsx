import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { useTyping } from '../../hooks/useTyping'
import { useContent } from '../../hooks/useContent'
import { useNavigation } from '../../hooks/useNavigation'
import coderImage from '/coder-girl.webp'

export default function Hero() {
  const { content } = useContent()
  const { setActiveSection } = useNavigation()
  const settings = content.settings || {}
  const typedText = useTyping(
    [settings.title || 'Full-Stack Developer', 'Open Source Enthusiast', 'Problem Solver'],
    100, 50, 2000
  )

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-primary dark:text-primary-light font-medium mb-4"
            >
              Hello, I'm
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              {settings.name || 'Nazreen Begum'}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-600 dark:text-gray-400"
            >
              {typedText}
              <span className="animate-pulse text-primary">|</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {settings.tagline || 'Building modern web experiences with clean code and creative design'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => setActiveSection('projects')}
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary/25"
              >
                View Projects
              </button>
              <button
                onClick={() => setActiveSection('contact')}
                className="px-8 py-3 border border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-lg font-medium transition-colors"
              >
                Get in Touch
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex gap-4 mt-8 justify-center lg:justify-start"
            >
              {settings.social?.github && (
                <a href={settings.social.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-all" aria-label="GitHub">
                  <FiGithub className="w-5 h-5" />
                </a>
              )}
              {settings.social?.linkedin && (
                <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-all" aria-label="LinkedIn">
                  <FiLinkedin className="w-5 h-5" />
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="p-3 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-all" aria-label="Email">
                  <FiMail className="w-5 h-5" />
                </a>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="hidden lg:flex justify-end ml-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-purple/20 to-accent/30 blur-2xl" style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }} />
              <img
                src={coderImage}
                alt="Coding illustration"
                className="relative w-96 h-80 object-cover shadow-2xl border-4 border-white/20 dark:border-white/10"
                style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
