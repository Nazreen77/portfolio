import { motion } from 'framer-motion'
import { FiAward, FiStar, FiBookOpen, FiMic } from 'react-icons/fi'
import { useContent } from '../../hooks/useContent'

const iconMap = {
  award: FiAward,
  trophy: FiStar,
  book: FiBookOpen,
  microphone: FiMic,
}

export default function Achievements() {
  const { content } = useContent()
  const achievements = content.achievements || {}
  const items = achievements.items || []

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          <span className="text-primary">Achievements</span>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon] || FiAward
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass dark:bg-white/5 bg-white/70 rounded-xl p-6 text-center hover:border-primary/50 transition-all"
              >
                <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-3 block">{item.date}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
