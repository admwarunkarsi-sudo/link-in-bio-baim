'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Plus, Trash2, Edit } from 'lucide-react'

export default function AdminDashboard() {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    const { data } = await supabase.from('links').select('*').order('order_index', { ascending: true })
    setLinks(data || [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('links').insert([{ title, url, order_index: links.length }])
    if (!error) {
      setTitle('')
      setUrl('')
      fetchLinks()
    } else {
      alert('Error adding link')
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    await supabase.from('links').delete().eq('id', id)
    fetchLinks()
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 p-8 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors bg-red-400/10 px-4 py-2 rounded-xl">
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="bg-[#1a1a1c] border border-gray-800 rounded-2xl p-6 shadow-xl mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Tambah Tombol Baru</h2>
          <form onSubmit={handleAddLink} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul Tombol (ex: WhatsApp Admin)"
              required
              className="flex-1 bg-[#252528] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL Tujuan (https://...)"
              required
              className="flex-1 bg-[#252528] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button disabled={loading} type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              <Plus size={20} /> Tambah
            </button>
          </form>
        </div>

        <div className="bg-[#1a1a1c] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Daftar Tombol Aktif</h2>
          {loading && links.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Memuat data...</p>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between bg-[#252528] border border-gray-700 p-4 rounded-xl group hover:border-gray-500 transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-200">{link.title}</h3>
                    <a href={link.url} target="_blank" className="text-sm text-blue-400 hover:underline">{link.url}</a>
                  </div>
                  <button onClick={() => handleDelete(link.id)} className="text-gray-500 hover:text-red-500 p-2 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {links.length === 0 && !loading && (
                <p className="text-gray-500 text-center py-8">Belum ada tombol yang dibuat.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
