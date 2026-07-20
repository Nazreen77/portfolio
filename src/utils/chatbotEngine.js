const TOPICS = {
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'what\'s up'],
  },
  about: {
    keywords: ['about', 'who are you', 'tell me about', 'introduce', 'yourself', 'background', 'who'],
  },
  skills: {
    keywords: ['skill', 'technology', 'tech', 'tech stack', 'techstack', 'specialize', 'specialization', 'tools', 'framework', 'language', 'proficient', 'expertise', 'capable'],
  },
  frontend: {
    keywords: ['frontend', 'front-end', 'ui', 'user interface', 'css', 'html', 'responsive', 'design', 'react', 'vue', 'next'],
  },
  backend: {
    keywords: ['backend', 'back-end', 'server', 'api', 'database', 'db', 'node', 'java', 'python', 'rest'],
  },
  devops: {
    keywords: ['devops', 'deploy', 'docker', 'aws', 'cloud', 'ci/cd', 'cicd', 'kubernetes', 'infrastructure', 'linux', 'pipeline'],
  },
  experience: {
    keywords: ['experience', 'years', 'worked', 'work', 'job', 'career', 'role', 'position', 'company', 'employment', 'professional'],
  },
  projects: {
    keywords: ['project', 'built', 'portfolio', 'app', 'application', 'side project', 'demo', 'repository', 'repo', 'github'],
  },
  education: {
    keywords: ['education', 'study', 'studied', 'degree', 'university', 'college', 'school', 'graduated', 'graduation', 'gpa', 'academic'],
  },
  certifications: {
    keywords: ['certification', 'certified', 'credential', 'license', 'aws', 'scrum', 'google cloud', 'gcp', 'exam'],
  },
  achievements: {
    keywords: ['achievement', 'award', 'accomplishment', 'honor', 'recognition', 'hackathon', 'speaker', 'published', 'contribution', 'open source'],
  },
  contact: {
    keywords: ['contact', 'email', 'reach', 'phone', 'call', 'connect', 'get in touch', 'talk', 'hire', 'location', 'where are you'],
  },
  availability: {
    keywords: ['available', 'hire', 'freelance', 'open to work', 'looking for', 'job search', 'available for work', 'work with you'],
  },
  thanks: {
    keywords: ['thanks', 'thank you', 'thx', 'appreciate', 'great', 'awesome', 'cool', 'nice'],
  },
  help: {
    keywords: ['help', 'what can you', 'what questions', 'options', 'menu', 'list', 'topics', 'ask'],
  },
}

const DEFAULT_RESPONSE =
  'I can help you learn about the developer behind this portfolio! Try asking about their skills, experience, projects, education, certifications, achievements, or how to contact them.'

const HELP_RESPONSE = [
  'You can ask me about:',
  '\u2022 **About** \u2014 Tell me about yourself',
  '\u2022 **Skills** \u2014 What technologies do you specialize in?',
  '\u2022 **Experience** \u2014 How many years of experience do you have?',
  '\u2022 **Projects** \u2014 Tell me about your projects',
  '\u2022 **Education** \u2014 Where did you study?',
  '\u2022 **Certifications** \u2014 What certifications do you have?',
  '\u2022 **Achievements** \u2014 Any notable achievements?',
  '\u2022 **Contact** \u2014 How can I contact you?',
].join('\n')

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
}

function matchesQuery(query, keywords) {
  const normalized = normalize(query)
  return keywords.some(keyword => normalized.includes(normalize(keyword)))
}

function detectTopic(query) {
  for (const [topic, config] of Object.entries(TOPICS)) {
    if (matchesQuery(query, config.keywords)) {
      return topic
    }
  }
  return null
}

export function generateAnswer(query, content) {
  const topic = detectTopic(query)
  if (!topic) return DEFAULT_RESPONSE

  const settings = content.settings || {}
  const about = content.about || {}
  const skills = content.skills || {}
  const experience = content.experience || {}
  const projects = content.projects || {}
  const education = content.education || {}
  const certifications = content.certifications || {}
  const achievements = content.achievements || {}

  const name = settings.name || 'the developer'
  const title = settings.title || ''

  switch (topic) {
    case 'greeting':
      return `Hello! 👋 I'm here to help you learn about ${name}. Ask me anything about their skills, experience, projects, or how to get in touch.`

    case 'about':
      {
        const summary = about.summary || ''
        const location = settings.location || ''
        let response = `${name} is a ${title}. ${summary}`
        if (location) response += ` Currently based in ${location}.`
        return response
      }

    case 'skills':
      {
        const allSkills = (skills.categories || []).flatMap(cat =>
          cat.skills.map(s => `${s.name} (${s.level}%)`)
        )
        const topSkills = allSkills.slice(0, 8)
        return `${name} has expertise in a wide range of technologies:\n\n${topSkills.join('\n')}\n\nAnd many more. Check out the Skills section for the full breakdown.`
      }

    case 'frontend':
      {
        const frontendCat = (skills.categories || []).find(c => c.name === 'Frontend')
        const frontendSkills = (frontendCat?.skills || []).map(s => `${s.name} (${s.level}%)`).join('\n')
        return frontendSkills
          ? `${name}'s frontend expertise includes:\n\n${frontendSkills}`
          : 'No frontend skills data available.'
      }

    case 'backend':
      {
        const backendCat = (skills.categories || []).find(c => c.name === 'Backend')
        const backendSkills = (backendCat?.skills || []).map(s => `${s.name} (${s.level}%)`).join('\n')
        return backendSkills
          ? `${name}'s backend expertise includes:\n\n${backendSkills}`
          : 'No backend skills data available.'
      }

    case 'devops':
      {
        const devopsCat = (skills.categories || []).find(c => c.name === 'DevOps')
        const devopsSkills = (devopsCat?.skills || []).map(s => `${s.name} (${s.level}%)`).join('\n')
        return devopsSkills
          ? `${name}'s DevOps skills include:\n\n${devopsSkills}`
          : 'No DevOps skills data available.'
      }

    case 'experience':
      {
        const items = experience.items || []
        const years = about.stats?.find(s => s.label === 'Years Experience')?.value || 'Several'
        let response = `${name} has ${years} of professional experience.\n\n`
        items.forEach(item => {
          response += `**${item.role}** at ${item.company} (${item.period})\n${item.description}\n`
        })
        return response.trim()
      }

    case 'projects':
      {
        const items = (projects.items || []).filter(p => p.featured)
        let response = items.length
          ? `${name}'s featured projects include:\n\n`
          : 'No featured projects available.\n'
        ;(projects.items || []).forEach(item => {
          response += `**${item.title}**\n${item.description}\nTech: ${item.technologies?.join(', ') || ''}\n`
        })
        return response.trim()
      }

    case 'education':
      {
        const items = education.items || []
        let response = ''
        items.forEach(item => {
          response += `${item.degree} from ${item.school} (${item.period})\n`
          if (item.gpa) response += `GPA: ${item.gpa}\n`
          if (item.description) response += `${item.description}\n`
        })
        return response || 'No education data available.'
      }

    case 'certifications':
      {
        const items = certifications.items || []
        let response = `${name} holds the following certifications:\n\n`
        items.forEach(item => {
          response += `• **${item.name}** — ${item.issuer} (${item.date})\n`
        })
        return response.trim()
      }

    case 'achievements':
      {
        const items = achievements.items || []
        let response = 'Here are some notable achievements:\n\n'
        items.forEach(item => {
          response += `• **${item.title}** (${item.date}) — ${item.description}\n`
        })
        return response.trim()
      }

    case 'contact':
      {
        let response = `You can reach ${name} through:\n`
        if (settings.email) response += `\n📧 Email: ${settings.email}`
        if (settings.phone) response += `\n📱 Phone: ${settings.phone}`
        if (settings.location) response += `\n📍 Location: ${settings.location}`
        if (settings.social?.linkedin) response += `\n💼 LinkedIn: ${settings.social.linkedin}`
        if (settings.social?.github) response += `\n🐙 GitHub: ${settings.social.github}`
        return response.trim()
      }

    case 'availability':
      return `${name} is open to opportunities! Reach out via ${settings.email || 'email'} to discuss potential collaborations or job opportunities.`

    case 'thanks':
      return `You're welcome! 😊 Feel free to ask if you have more questions.`

    case 'help':
      return HELP_RESPONSE

    default:
      return DEFAULT_RESPONSE
  }
}

export const QUICK_QUESTIONS = [
  'Tell me about yourself',
  'What are your top skills?',
  'How many years of experience?',
  'Tell me about your projects',
  'How can I contact you?',
]
