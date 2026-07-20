import { useState } from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../../hooks/useContent'

export default function Skills() {
  const { content } = useContent()
  const skills = content.skills || {}
  const categories = skills.categories || []
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          My <span className="text-primary">Skills</span>
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === index
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(categories[activeTab]?.skills || []).map((skill) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass dark:bg-white/5 bg-white/70 rounded-xl p-6 hover:border-primary/50 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{skill.name}</h3>
                <span className="text-sm font-medium text-primary">{skill.level}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
