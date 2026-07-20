import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950"
      style={{ pointerEvents: 'auto' }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 1.2 }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-4 h-4 rounded-full bg-gradient-to-r from-primary via-purple to-accent"
      />
    </motion.div>
  )
}
