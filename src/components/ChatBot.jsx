import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'
import { useContent } from '../hooks/useContent'
import { generateAnswer, QUICK_QUESTIONS } from '../utils/chatbotEngine'

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
        AD
      </div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }) {
  const isBot = message.sender === 'bot'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 mb-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
          AD
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
          isBot
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md'
            : 'bg-primary text-white rounded-br-md'
        }`}
      >
        {message.text}
      </div>
    </motion.div>
  )
}

function QuickQuestions({ onAsk }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {QUICK_QUESTIONS.map((q) => (
        <button
          key={q}
          onClick={() => onAsk(q)}
          className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors"
        >
          {q}
        </button>
      ))}
    </div>
  )
}

export default function ChatBot() {
  const { content } = useContent()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleAsk = (question) => {
    const userMessage = { sender: 'user', text: question }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    const delay = Math.min(400 + question.length * 10, 1200)
    setTimeout(() => {
      const answer = generateAnswer(question, content)
      setIsTyping(false)
      setMessages((prev) => [...prev, { sender: 'bot', text: answer }])
    }, delay)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    handleAsk(trimmed)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[90vw] sm:w-96 h-[60vh] sm:h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-white rounded-t-2xl flex-shrink-0">
              <div>
                <h3 className="font-semibold text-sm">Portfolio Assistant</h3>
                <p className="text-xs text-white/80">Ask me anything</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <FiMessageCircle className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hi! I'm the Portfolio Assistant
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Ask me about skills, experience, projects & more
                  </p>
                  <QuickQuestions onAsk={handleAsk} />
                </div>
              )}

              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 flex items-center justify-center transition-colors"
        aria-label="Toggle chat assistant"
      >
        {isOpen ? (
          <FiX className="w-6 h-6" />
        ) : (
          <FiMessageCircle className="w-6 h-6" />
        )}
      </motion.button>
    </>
  )
}
