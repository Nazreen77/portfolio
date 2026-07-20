import { motion } from 'framer-motion'
import { FiDownload, FiMapPin, FiMail } from 'react-icons/fi'
import { useContent } from '../../hooks/useContent'

export default function About() {
  const { content } = useContent()
  const about = content.about || {}
  const settings = content.settings || {}
  const stats = about.stats || []

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          About <span className="text-primary">Me</span>
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass dark:bg-white/5 bg-white/70 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4">Who I Am</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {about.summary || ''}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                {settings.location && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FiMapPin className="text-primary" />
                    <span>{settings.location}</span>
                  </div>
                )}
                {settings.email && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FiMail className="text-primary" />
                    <span>{settings.email}</span>
                  </div>
                )}
              </div>
              {settings.resume && (
                <a
                  href={settings.resume}
                  download
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                >
                  <FiDownload /> Download Resume
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass dark:bg-white/5 bg-white/70 rounded-2xl p-6 text-center hover:border-primary/50 transition-colors"
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
