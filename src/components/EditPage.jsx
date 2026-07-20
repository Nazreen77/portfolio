import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiLock, FiSave, FiPlus, FiTrash2, FiCheck, FiRefreshCw, FiHome } from 'react-icons/fi'
import { useContent } from '../hooks/useContent'

const PIN = import.meta.env.VITE_EDIT_PIN || ''
const isDev = import.meta.env.DEV

/* Simple YAML serializer for our content structure */
function toYaml(data, indent = 0) {
  const pad = '  '.repeat(indent)
  let out = ''
  const entries = Object.entries(data)
  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      out += `${pad}${key}:\n`
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          const itemEntries = Object.entries(item)
          out += `${pad}- ${itemEntries[0][0]}: ${formatValue(itemEntries[0][1], indent + 2)}\n`
          for (let j = 1; j < itemEntries.length; j++) {
            const [k, v] = itemEntries[j]
            out += `${pad}  ${k}: ${formatValue(v, indent + 2)}\n`
          }
        } else {
          out += `${pad}- ${scalar(item)}\n`
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      out += `${pad}${key}:\n${toYaml(value, indent + 1)}`
    } else {
      out += `${pad}${key}: ${scalar(value)}\n`
    }
  }
  return out
}

function formatValue(v, indent) {
  const pad = '  '.repeat(indent)
  if (Array.isArray(v)) {
    let out = '\n'
    for (const item of v) {
      if (typeof item === 'object' && item !== null) {
        const itemEntries = Object.entries(item)
        out += `${pad}- ${itemEntries[0][0]}: ${formatValue(itemEntries[0][1], indent + 2)}\n`
        for (let j = 1; j < itemEntries.length; j++) {
          const [k, iv] = itemEntries[j]
          out += `${pad}  ${k}: ${formatValue(iv, indent + 2)}\n`
        }
      } else {
        out += `${pad}- ${scalar(item)}\n`
      }
    }
    return out.replace(/\n$/, '')
  }
  if (typeof v === 'object' && v !== null) {
    return '\n' + toYaml(v, indent + 1)
  }
  return scalar(v)
}

function scalar(v) {
  if (v === true) return 'true'
  if (v === false) return 'false'
  if (Array.isArray(v)) return '[' + v.map(scalar).join(', ') + ']'
  if (typeof v === 'number') return String(v)
  if (typeof v !== 'string') return String(v)
  // quote strings that could be misinterpreted
  if (v === '' || v === 'true' || v === 'false' || /^[\d.]+$/.test(v) || v.includes(':') || v.includes('#') || v.includes("'") || v.includes('"')) {
    return '"' + v.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
  }
  return v
}

const tabs = [
  { id: 'settings', label: 'Profile' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'education', label: 'Education' },
  { id: 'achievements', label: 'Achievements' },
]

export default function EditPage() {
  const { content, reloadContent } = useContent()
  const [unlocked, setUnlocked] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  const [activeTab, setActiveTab] = useState('settings')
  const [saving, setSaving] = useState(false)
  const [building, setBuilding] = useState(false)
  const [buildOutput, setBuildOutput] = useState('')
  const [statusMsg, setStatusMsg] = useState('')

  const showStatus = useCallback((msg) => {
    setStatusMsg(msg)
    setTimeout(() => setStatusMsg(''), 3000)
  }, [])

  const handlePinSubmit = (e) => {
    e.preventDefault()
    if (pinInput === PIN) {
      setUnlocked(true)
      setPinError(false)
    } else {
      setPinError(true)
      setPinInput('')
    }
  }

  const writeYaml = async (fileName, data) => {
    if (!isDev) return
    setSaving(true)
    setBuildOutput('')
    try {
      const yamlStr = toYaml(data)
      const res = await fetch('/api/edit/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: fileName, content: yamlStr }),
      })
      const result = await res.json()
      if (result.success) {
        await reloadContent()
        showStatus('Saved successfully!')
      } else {
        showStatus('Error: ' + result.error)
      }
    } catch (err) {
      showStatus('Save failed: ' + err.message)
    }
    setSaving(false)
  }

  const handleBuild = async () => {
    setBuilding(true)
    setBuildOutput('')
    try {
      const res = await fetch('/api/edit/build', { method: 'POST' })
      const result = await res.json()
      setBuildOutput(result.output || '')
      showStatus(result.success ? 'Build complete!' : 'Build failed')
    } catch (err) {
      showStatus('Build failed: ' + err.message)
    }
    setBuilding(false)
  }

  if (!isDev) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <FiLock className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h1 className="text-2xl font-bold text-gray-400">Edit Mode Disabled</h1>
          <p className="text-gray-500 mt-2">This feature is only available in local development.</p>
        </div>
      </div>
    )
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Content Editor</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your PIN to continue</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value); setPinError(false) }}
              className={`w-full text-center text-2xl tracking-widest px-4 py-3 rounded-xl border-2 ${pinError ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} focus:border-primary outline-none dark:bg-gray-800`}
              placeholder="••••••"
              autoFocus
            />
            {pinError && <p className="text-red-500 text-sm text-center">Incorrect PIN</p>}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Unlock
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-left">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.location.hash = '' }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              <FiHome className="w-5 h-5" />
              <span className="text-sm">Back to Site</span>
            </a>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Content Editor
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBuild}
              disabled={building}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${building ? 'animate-spin' : ''}`} />
              {building ? 'Building...' : 'Build'}
            </button>
          </div>
        </div>
      </div>

      {/* Status message */}
      {statusMsg && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <FiCheck className="w-4 h-4" />
          {statusMsg}
        </div>
      )}

      {/* Build output */}
      {buildOutput && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className={`p-4 rounded-xl text-sm font-mono whitespace-pre-wrap ${building ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'}`}>
            {buildOutput}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="flex gap-1 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'settings' && <SettingsEditor data={content.settings} writeYaml={writeYaml} fileName="settings.yaml" saving={saving} />}
        {activeTab === 'about' && <AboutEditor data={content.about} writeYaml={writeYaml} fileName="about.yaml" saving={saving} />}
        {activeTab === 'skills' && <SkillsEditor data={content.skills} writeYaml={writeYaml} fileName="skills.yaml" saving={saving} />}
        {activeTab === 'experience' && <ListItemEditor title="Experience" data={content.experience?.items || []} writeYaml={writeYaml} fileName="experience.yaml" saving={saving} rootKey="items" fields={[
          { key: 'company', label: 'Company', type: 'text' },
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'period', label: 'Period', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'technologies', label: 'Technologies (comma-separated)', type: 'tags' },
        ]} />}
        {activeTab === 'projects' && <ListItemEditor title="Projects" data={content.projects?.items || []} writeYaml={writeYaml} fileName="projects.yaml" saving={saving} rootKey="items" fields={[
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'image', label: 'Image URL', type: 'text' },
          { key: 'technologies', label: 'Technologies (comma-separated)', type: 'tags' },
          { key: 'category', label: 'Category', type: 'select', options: ['Full Stack', 'Frontend', 'Backend'] },
          { key: 'liveUrl', label: 'Live URL', type: 'text' },
          { key: 'githubUrl', label: 'GitHub URL', type: 'text' },
          { key: 'featured', label: 'Featured', type: 'checkbox' },
        ]} />}
        {activeTab === 'certifications' && <ListItemEditor title="Certifications" data={content.certifications?.items || []} writeYaml={writeYaml} fileName="certifications.yaml" saving={saving} rootKey="items" fields={[
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'issuer', label: 'Issuer', type: 'text' },
          { key: 'date', label: 'Date', type: 'text' },
          { key: 'credentialId', label: 'Credential ID', type: 'text' },
          { key: 'url', label: 'URL', type: 'text' },
        ]} />}
        {activeTab === 'education' && <ListItemEditor title="Education" data={content.education?.items || []} writeYaml={writeYaml} fileName="education.yaml" saving={saving} rootKey="items" fields={[
          { key: 'degree', label: 'Degree', type: 'text' },
          { key: 'school', label: 'School', type: 'text' },
          { key: 'period', label: 'Period', type: 'text' },
          { key: 'gpa', label: 'GPA', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ]} />}
        {activeTab === 'achievements' && <ListItemEditor title="Achievements" data={content.achievements?.items || []} writeYaml={writeYaml} fileName="achievements.yaml" saving={saving} rootKey="items" fields={[
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'date', label: 'Date', type: 'text' },
          { key: 'icon', label: 'Icon', type: 'select', options: ['award', 'trophy', 'book', 'microphone'] },
        ]} />}
      </div>
    </div>
  )
}

/* ─── Settings Editor ─── */
function SettingsEditor({ data, writeYaml, fileName, saving }) {
  const [form, setForm] = useState(data || {})
  useEffect(() => { setForm(data || {}) }, [data])

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const updateSocial = (key, value) => setForm(prev => ({ ...prev, social: { ...(prev.social || {}), [key]: value } }))

  const handleSave = () => {
    writeYaml(fileName, form)
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 outline-none focus:border-primary text-sm"

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-bold">Profile Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name"><input className={inputClass} value={form.name || ''} onChange={e => update('name', e.target.value)} /></Field>
        <Field label="Title"><input className={inputClass} value={form.title || ''} onChange={e => update('title', e.target.value)} /></Field>
        <Field label="Email"><input className={inputClass} value={form.email || ''} onChange={e => update('email', e.target.value)} /></Field>
        <Field label="Phone"><input className={inputClass} value={form.phone || ''} onChange={e => update('phone', e.target.value)} /></Field>
        <Field label="Location"><input className={inputClass} value={form.location || ''} onChange={e => update('location', e.target.value)} /></Field>
        <Field label="Avatar URL"><input className={inputClass} value={form.avatar || ''} onChange={e => update('avatar', e.target.value)} /></Field>
        <Field label="Resume URL"><input className={inputClass} value={form.resume || ''} onChange={e => update('resume', e.target.value)} /></Field>
        <Field label="Tagline"><input className={inputClass} value={form.tagline || ''} onChange={e => update('tagline', e.target.value)} /></Field>
      </div>
      <div className="border-t dark:border-gray-800 pt-4">
        <h3 className="font-medium mb-3">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="GitHub"><input className={inputClass} value={form.social?.github || ''} onChange={e => updateSocial('github', e.target.value)} /></Field>
          <Field label="LinkedIn"><input className={inputClass} value={form.social?.linkedin || ''} onChange={e => updateSocial('linkedin', e.target.value)} /></Field>
          <Field label="Twitter"><input className={inputClass} value={form.social?.twitter || ''} onChange={e => updateSocial('twitter', e.target.value)} /></Field>
          <Field label="Portfolio"><input className={inputClass} value={form.social?.portfolio || ''} onChange={e => updateSocial('portfolio', e.target.value)} /></Field>
        </div>
      </div>
      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
        <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

/* ─── About Editor ─── */
function AboutEditor({ data, writeYaml, fileName, saving }) {
  const [form, setForm] = useState({ summary: '', bio: '', stats: [] })
  useEffect(() => {
    if (data) {
      setForm({ summary: data.summary || '', bio: data.bio || '', stats: data.stats || [] })
    }
  }, [data])

  const updateStat = (i, key, value) => {
    setForm(prev => ({ ...prev, stats: prev.stats.map((s, idx) => idx === i ? { ...s, [key]: value } : s) }))
  }
  const addStat = () => setForm(prev => ({ ...prev, stats: [...prev.stats, { label: '', value: '' }] }))
  const removeStat = (i) => setForm(prev => ({ ...prev, stats: prev.stats.filter((_, idx) => idx !== i) }))

  const handleSave = () => writeYaml(fileName, form)
  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 outline-none focus:border-primary text-sm"

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-bold">About Me</h2>
      <Field label="Summary"><textarea className={inputClass} rows={3} value={form.summary} onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))} /></Field>
      <Field label="Bio"><textarea className={inputClass} rows={3} value={form.bio} onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))} /></Field>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-medium">Stats</label>
          <button onClick={addStat} className="flex items-center gap-1 text-sm text-primary hover:opacity-80"><FiPlus className="w-4 h-4" /> Add</button>
        </div>
        <div className="space-y-2">
          {form.stats.map((stat, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input className={`${inputClass} flex-1`} placeholder="Label" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} />
              <input className={`${inputClass} w-24`} placeholder="Value" value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} />
              <button onClick={() => removeStat(i)} className="p-2 text-red-400 hover:text-red-600"><FiTrash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
        <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

/* ─── Skills Editor ─── */
function SkillsEditor({ data, writeYaml, fileName, saving }) {
  const [categories, setCategories] = useState([])
  useEffect(() => {
    if (data?.categories && Array.isArray(data.categories)) setCategories(data.categories)
  }, [data?.categories])

  const updateCategory = (i, value) => setCategories(prev => prev.map((c, idx) => idx === i ? { ...c, name: value } : c))
  const addCategory = () => setCategories(prev => [...prev, { name: '', skills: [] }])
  const removeCategory = (i) => setCategories(prev => prev.filter((_, idx) => idx !== i))

  const addSkill = (ci) => setCategories(prev => prev.map((c, idx) => idx === ci ? { ...c, skills: [...c.skills, { name: '', level: 80 }] } : c))
  const updateSkill = (ci, si, key, value) => {
    setCategories(prev => prev.map((c, idx) => idx === ci ? {
      ...c, skills: c.skills.map((s, sidx) => sidx === si ? { ...s, [key]: value } : s)
    } : c))
  }
  const removeSkill = (ci, si) => setCategories(prev => prev.map((c, idx) => idx === ci ? { ...c, skills: c.skills.filter((_, sidx) => sidx !== si) } : c))

  const handleSave = () => writeYaml(fileName, { categories })
  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-left outline-none focus:border-primary text-sm"

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Skills</h2>
        <button onClick={addCategory} className="flex items-center gap-1 text-sm text-primary hover:opacity-80"><FiPlus className="w-4 h-4" /> Add Category</button>
      </div>
      {categories.map((cat, ci) => (
        <div key={ci} className="border dark:border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex gap-2 items-center">
            <input className={`${inputClass} flex-1`} placeholder="Category name" value={cat.name || ''} onChange={e => updateCategory(ci, e.target.value)} />
            <button onClick={() => removeCategory(ci)} className="p-2 text-red-400 hover:text-red-600"><FiTrash2 className="w-4 h-4" /></button>
          </div>
          <div className="space-y-2 pl-4">
            {(cat.skills || []).map((skill, si) => (
              <div key={si} className="flex gap-2 items-center">
                <input className="w-56 px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary text-sm" style={{ backgroundColor: '#fff' }} placeholder="Skill name" value={skill.name || ''} onChange={e => updateSkill(ci, si, 'name', e.target.value)} />
                <input className="w-20 px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary text-sm" style={{ backgroundColor: '#fff' }} type="number" min={0} max={100} placeholder="%" value={skill.level || ''} onChange={e => updateSkill(ci, si, 'level', parseInt(e.target.value) || 0)} />
                <button onClick={() => removeSkill(ci, si)} className="p-2 text-red-400 hover:text-red-600"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => addSkill(ci)} className="flex items-center gap-1 text-sm text-primary hover:opacity-80 mt-1"><FiPlus className="w-4 h-4" /> Add Skill</button>
          </div>
        </div>
      ))}
      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
        <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

/* ─── Generic List Item Editor ─── */
function ListItemEditor({ title, data, writeYaml, fileName, saving, rootKey, fields }) {
  const normalize = (d) => Array.isArray(d) ? d : (d && typeof d === 'object' ? [d] : [])
  const [items, setItems] = useState([])
  useEffect(() => { setItems(normalize(data)) }, [data])

  const blankItem = () => {
    const item = {}
    fields.forEach(f => {
      if (f.type === 'checkbox') item[f.key] = false
      else if (f.type === 'tags') item[f.key] = []
      else item[f.key] = ''
    })
    return item
  }

  const updateItem = (i, key, value) => setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [key]: value } : item))
  const addItem = () => setItems(prev => [...prev, blankItem()])
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const handleSave = () => writeYaml(fileName, { [rootKey]: items })
  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 outline-none focus:border-primary text-sm"

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <button onClick={addItem} className="flex items-center gap-1 text-sm text-primary hover:opacity-80"><FiPlus className="w-4 h-4" /> Add</button>
      </div>
      {items.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border dark:border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">#{i + 1}</span>
            <button onClick={() => removeItem(i)} className="p-1.5 text-red-400 hover:text-red-600"><FiTrash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map(f => (
              <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea className={inputClass} rows={2} value={item[f.key] || ''} onChange={e => updateItem(i, f.key, e.target.value)} />
                ) : f.type === 'select' ? (
                  <select className={inputClass} value={item[f.key] || ''} onChange={e => updateItem(i, f.key, e.target.value)}>
                    <option value="">Select...</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === 'checkbox' ? (
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!item[f.key]} onChange={e => updateItem(i, f.key, e.target.checked)} className="w-4 h-4 accent-primary" />
                    <span className="text-sm">Yes</span>
                  </label>
                ) : f.type === 'tags' ? (
                  <input className={inputClass} placeholder="Comma-separated" value={Array.isArray(item[f.key]) ? item[f.key].join(', ') : (item[f.key] || '')} onChange={e => updateItem(i, f.key, e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
                ) : (
                  <input className={inputClass} value={item[f.key] || ''} onChange={e => updateItem(i, f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
      {items.length === 0 && <p className="text-center text-gray-400 py-8">No items yet. Click "Add" to create one.</p>}
      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
        <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

/* ─── Field wrapper ─── */
function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      {children}
    </div>
  )
}
