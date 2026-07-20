import { useState, useEffect, lazy, Suspense } from 'react'
import Header from './layouts/Header'
import LoadingScreen from './components/LoadingScreen'
import ChatBot from './components/ChatBot'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Experience from './components/sections/Experience'
import Projects from './components/sections/Projects'
import Certifications from './components/sections/Certifications'
import Education from './components/sections/Education'
import Achievements from './components/sections/Achievements'
import Contact from './components/sections/Contact'
import Footer from './components/sections/Footer'
import { ThemeProvider } from './hooks/useTheme'
import { ContentProvider } from './hooks/useContent'
import { NavigationProvider, useNavigation } from './hooks/useNavigation'
import { motion, AnimatePresence } from 'framer-motion'

const sections = {
  hero: Hero,
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  certifications: Certifications,
  education: Education,
  achievements: Achievements,
  contact: Contact,
}

function AppContent() {
  const { activeSection } = useNavigation()
  const SectionComponent = sections[activeSection]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="pt-16"
        >
          {SectionComponent && <SectionComponent />}
        </motion.div>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

function App() {
  const [isEdit, setIsEdit] = useState(window.location.hash === '#/edit')

  useEffect(() => {
    const handler = () => setIsEdit(window.location.hash === '#/edit')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (isEdit) {
    const EditPage = lazy(() => import('./components/EditPage'))
    return (
      <ThemeProvider>
        <ContentProvider>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading editor...</div>}>
            <EditPage />
          </Suspense>
        </ContentProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <ContentProvider>
        <NavigationProvider>
          <LoadingScreen />
          <AppContent />
          <ChatBot />
        </NavigationProvider>
      </ContentProvider>
    </ThemeProvider>
  )
}

export default App
