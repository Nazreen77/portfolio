import { motion } from 'framer-motion'
import { FiAward, FiExternalLink } from 'react-icons/fi'
import { useContent } from '../../hooks/useContent'

export default function Certifications() {
  const { content } = useContent()
  const certifications = content.certifications || {}
  const items = certifications.items || []

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          <span className="text-primary">Certifications</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((cert, index) => (
            <motion.a
              key={index}
              href={cert.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass dark:bg-white/5 bg-white/70 rounded-xl p-6 hover:border-primary/50 transition-all hover:-translate-y-1 block"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <FiAward className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1 truncate">{cert.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{cert.date}</p>
                </div>
                <FiExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
