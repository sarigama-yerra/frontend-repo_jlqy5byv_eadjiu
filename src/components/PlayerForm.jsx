import { useState } from 'react'

const defaultLinks = [
  { label: 'Transfermarkt', url: '' },
  { label: 'Instagram', url: '' },
  { label: 'Full Match Video', url: '' },
  { label: 'CV', url: '' },
]

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function PlayerForm() {
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    country: '',
    position: '',
    height: '',
    weight: '',
    dominant_foot: '',
    current_club: '',
    past_clubs: '',
    bio: '',
    highlight_video_link: '',
  })

  const [extraLinks, setExtraLinks] = useState(defaultLinks)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [highlightVideo, setHighlightVideo] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLinkChange = (idx, value) => {
    setExtraLinks((prev) => prev.map((l, i) => (i === idx ? { ...l, url: value } : l)))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    let profile_photo_base64 = null
    let highlight_video_base64 = null

    try {
      if (profilePhoto) profile_photo_base64 = await fileToBase64(profilePhoto)
      if (highlightVideo) highlight_video_base64 = await fileToBase64(highlightVideo)

      const payload = {
        ...form,
        age: form.age ? Number(form.age) : null,
        extra_links: extraLinks.filter((l) => l.url),
        profile_photo_base64,
        highlight_video_base64,
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to submit')
      const data = await res.json()
      setStatus({ ok: true, id: data.id })
      // Reset form
      setForm({
        full_name: '', age: '', country: '', position: '', height: '', weight: '',
        dominant_foot: '', current_club: '', past_clubs: '', bio: '', highlight_video_link: '',
      })
      setExtraLinks(defaultLinks)
      setProfilePhoto(null)
      setHighlightVideo(null)
      e.target.reset()
    } catch (err) {
      setStatus({ ok: false, message: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Player Information</h1>
        <form onSubmit={onSubmit} className="bg-white shadow-sm ring-1 ring-gray-100 rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Full Name</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Age</label>
              <input name="age" type="number" value={form.age} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Country</label>
              <input name="country" value={form.country} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Position</label>
              <input name="position" value={form.position} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Height</label>
              <input name="height" value={form.height} onChange={handleChange} placeholder="e.g., 180 cm" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Weight</label>
              <input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g., 75 kg" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Dominant Foot</label>
              <input name="dominant_foot" value={form.dominant_foot} onChange={handleChange} placeholder="Left or Right" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Current Club</label>
              <input name="current_club" value={form.current_club} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Past Clubs</label>
              <input name="past_clubs" value={form.past_clubs} onChange={handleChange} placeholder="Comma-separated" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Bio / About Me</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Media</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Profile Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-700" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Highlight Video (file)</label>
                <input type="file" accept="video/*" onChange={(e) => setHighlightVideo(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-700" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Or paste a YouTube/Drive link</label>
                <input name="highlight_video_link" value={form.highlight_video_link} onChange={handleChange} placeholder="https://" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Extra Links</h2>
            <div className="grid grid-cols-1 gap-3">
              {extraLinks.map((l, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-40 text-sm text-gray-700">{l.label}</div>
                  <input value={l.url} onChange={(e) => handleLinkChange(idx, e.target.value)} placeholder="https://" className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-md transition-colors">
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            {status && (
              <p className={`mt-3 text-sm ${status.ok ? 'text-green-600' : 'text-red-600'}`}>
                {status.ok ? 'Submitted successfully!' : `Error: ${status.message}`}
              </p>
            )}
          </div>
        </form>
        <p className="text-center text-xs text-gray-500 mt-6">This page is only for collecting a player’s information and media.</p>
      </div>
    </div>
  )
}
