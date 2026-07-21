import { createContext, useContext, useEffect, useState } from 'react'
import { parse } from 'yaml'

const ContentContext = createContext()

async function loadContent() {
  const base = import.meta.env.BASE_URL || '/'
  const files = {
    settings: `${base}content/settings.yaml`,
    about: `${base}content/about.yaml`,
    skills: `${base}content/skills.yaml`,
    experience: `${base}content/experience.yaml`,
    projects: `${base}content/projects.yaml`,
    certifications: `${base}content/certifications.yaml`,
    education: `${base}content/education.yaml`,
    achievements: `${base}content/achievements.yaml`,
  }

  const content = {}
  for (const [key, path] of Object.entries(files)) {
    try {
      const response = await fetch(path)
      const text = await response.text()
      content[key] = parse(text)
    } catch (error) {
      console.error(`Failed to load ${key}:`, error)
      content[key] = {}
    }
  }
  return content
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)

  const reloadContent = () => loadContent().then(data => {
    setContent(data)
    const settings = data.settings || {}
    const name = settings.name || 'Developer'
    const title = settings.title || 'Full-Stack Developer'
    const tagline = settings.tagline || 'Building modern web applications'

    document.title = `${name} — ${title}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', tagline)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${name} — ${title}`)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', tagline)
  })

  useEffect(() => {
    reloadContent().then(() => setLoading(false))
  }, [])

  return (
    <ContentContext.Provider value={{ content, loading, reloadContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  return useContext(ContentContext)
}
