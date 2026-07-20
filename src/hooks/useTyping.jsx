import { useState, useEffect } from 'react'

export function useTyping(words, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (!words?.length) return

    const currentWord = words[wordIndex % words.length]
    
    const timeout = setTimeout(() => {
      if (isTyping) {
        setText(currentWord.substring(0, text.length + 1))
        if (text.length === currentWord.length) {
          setIsTyping(false)
        }
      } else {
        setText(currentWord.substring(0, text.length - 1))
        if (text.length === 0) {
          setWordIndex(prev => prev + 1)
          setIsTyping(true)
        }
      }
    }, isTyping ? typingSpeed : deletingSpeed)

    return () => clearTimeout(timeout)
  }, [text, isTyping, wordIndex, words, typingSpeed, deletingSpeed])

  return text
}
