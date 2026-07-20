import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { useContent } from '../../hooks/useContent'

export default function Projects() {
  const { content } = useContent()
  const projects = content.projects || {}
  const allProjects = projects.items || []
  const [filter, setFilter] = useState('All')

  const categories = useMemo(() => {
    const cats = new Set(allProjects.map(p => p.category))
    return ['All', ...cats]
  }, [allProjects])

  const filtered = filter === 'All' ? allProjects : allProjects.filter(p => p.category === filter)

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          Featured <span className="text-primary">Projects</span>
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === category
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <motion.div
              layout
              key={project.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass dark:bg-white/5 bg-white/70 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-2 group"
            >
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-white/30">{project.title.charAt(0)}</span>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="overflow-x-auto mb-4 scrollbar-hide">
                  <div className="flex gap-2 pb-1">
                    {project.technologies?.map(tech => (
                      <span
                        key={tech}
                        className="shrink-0 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary dark:text-primary-light whitespace-nowrap"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <FiExternalLink className="w-4 h-4" /> Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                      <FiGithub className="w-4 h-4" /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
