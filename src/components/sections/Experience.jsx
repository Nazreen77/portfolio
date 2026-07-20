import { motion } from 'framer-motion'
import { FiCalendar } from 'react-icons/fi'
import { useContent } from '../../hooks/useContent'

export default function Experience() {
  const { content } = useContent()
  const experience = content.experience || {}
  const items = experience.items || []

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          Work <span className="text-primary">Experience</span>
        </motion.h2>

        <div className="max-w-3xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 pb-12 last:pb-0 border-l-2 border-gray-200 dark:border-gray-800 last:border-l-0"
            >
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-gray-950" />

              <div className="glass dark:bg-white/5 bg-white/70 rounded-xl p-6 hover:border-primary/50 transition-all">
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <h3 className="text-xl font-semibold">{item.role}</h3>
                  <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
                    <FiCalendar className="w-3 h-3" /> {item.period}
                  </span>
                </div>
                <div className="text-primary font-medium mb-3">{item.company}</div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-primary-light"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
