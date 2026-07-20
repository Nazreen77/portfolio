import { motion } from 'framer-motion'
import { FiBookOpen, FiCalendar } from 'react-icons/fi'
import { useContent } from '../../hooks/useContent'

export default function Education() {
  const { content } = useContent()
  const education = content.education || {}
  const items = education.items || []

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          <span className="text-primary">Education</span>
        </motion.h2>

        <div className="max-w-3xl mx-auto space-y-6">
          {items.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass dark:bg-white/5 bg-white/70 rounded-xl p-6 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <FiBookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <p className="text-primary font-medium">{edu.school}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" /> {edu.period}
                    </span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                  {edu.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-3">{edu.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
