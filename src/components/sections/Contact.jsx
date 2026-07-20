import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import { useContent } from '../../hooks/useContent'

export default function Contact() {
  const { content } = useContent()
  const settings = content.settings || {}
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.target
    const formDataObj = new FormData(form)
    formDataObj.append('_subject', formData.subject)
    fetch(form.action, { method: 'POST', body: formDataObj })
      .then(() => { setStatus('success'); setFormData({ name: '', email: '', subject: '', message: '' }) })
      .catch(() => setStatus('error'))
  }

  const contactInfo = [
    { icon: FiMail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    { icon: FiPhone, label: 'Phone', value: settings.phone, href: `tel:${settings.phone}` },
    { icon: FiMapPin, label: 'Location', value: settings.location, href: '#' },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-center mb-16"
        >
          Get in <span className="text-primary">Touch</span>
        </motion.h2>

        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="text-xl font-semibold mb-6">Let's connect</h3>
            {contactInfo.map((info) =>
              info.value ? (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex items-center gap-4 p-4 glass dark:bg-white/5 bg-white/70 rounded-xl hover:border-primary/50 transition-all"
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{info.label}</div>
                    <div className="font-medium">{info.value}</div>
                  </div>
                </a>
              ) : null
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form
              action="https://formspree.io/f/your-form-id"
              method="POST"
              onSubmit={handleSubmit}
              className="glass dark:bg-white/5 bg-white/70 rounded-2xl p-8"
            >
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder="What's this about?"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <FiSend /> {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              {status === 'success' && <p className="text-green-500 mt-4">Message sent successfully!</p>}
              {status === 'error' && <p className="text-red-500 mt-4">Failed to send message. Please try again.</p>}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
