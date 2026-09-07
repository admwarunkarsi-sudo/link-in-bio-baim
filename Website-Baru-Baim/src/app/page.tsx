'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

// Halaman utama publik
export default function Home() {
  const [profile, setProfile] = useState<any>(null)
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Follow Gate State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasClickedIg1, setHasClickedIg1] = useState(false)
  const [hasClickedIg2, setHasClickedIg2] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const fetchData = async () => {
      const { data: p } = await supabase.from('profile_settings').select('*').single()
      const { data: l } = await supabase.from('links').select('*').eq('is_active', true).order('order_index', { ascending: true })
      setProfile(p)
      setLinks(l || [])
      setLoading(false)
    }
    fetchData()

    // Cek Session Storage untuk Follow Gate
    if (typeof window !== 'undefined') {
      const ig1 = sessionStorage.getItem('ig1_clicked') === 'true'
      const ig2 = sessionStorage.getItem('ig2_clicked') === 'true'
      const modalOpen = sessionStorage.getItem('modal_open') === 'true'
      
      setHasClickedIg1(ig1)
      setHasClickedIg2(ig2)
      
      if (modalOpen) {
        setIsModalOpen(true)
      }
    }
  }, [])

  const openFollowGate = () => {
    setIsModalOpen(true)
    if (typeof window !== 'undefined') sessionStorage.setItem('modal_open', 'true')
  }

  const closeFollowGate = () => {
    setIsModalOpen(false)
    if (typeof window !== 'undefined') sessionStorage.removeItem('modal_open')
  }

  const clickedIg1 = (e: React.MouseEvent) => {
    e.preventDefault()
    setHasClickedIg1(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ig1_clicked', 'true')
      window.location.href = "https://www.instagram.com/baimdaily"
    }
  }

  const clickedIg2 = (e: React.MouseEvent) => {
    e.preventDefault()
    setHasClickedIg2(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ig2_clicked', 'true')
      window.location.href = "https://www.instagram.com/warunkarsi.bekasi"
    }
  }

  const isUnlocked = hasClickedIg1 && hasClickedIg2

  if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-gray-500">Memuat...</div>

  return (
    <div className="bg-[#121212] text-gray-100 font-sans min-h-screen flex flex-col items-center py-8 px-4 selection:bg-orange-500 selection:text-white">
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        
        {/* HEADER PROFIL */}
        <header className="flex flex-col items-center mb-10 text-center">
          <div className="relative w-28 h-28 mb-4">
            <img 
              src={profile?.profile_image_url || "https://ui-avatars.com/api/?name=Baim&background=F97316&color=fff"} 
              alt="Foto Profil" 
              className="w-full h-full rounded-full object-cover border-4 border-[#1f1f1f] shadow-lg"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#121212] rounded-full"></span>
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-white">{profile?.name} | {profile?.username}</h1>
          <p className="text-sm text-gray-400 font-medium mb-4">{profile?.bio}</p>
        </header>

        {/* UTAMA - CALL TO ACTION BUTTONS */}
        <main className="flex flex-col gap-5 w-full mb-12">
          
          {/* YOUTUBE VIDEO FIXED */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-[#2a2a2a] mb-2 relative bg-black">
              <iframe className="w-full h-full absolute top-0 left-0" src="https://www.youtube.com/embed/4i8HLUOZAu0?si=VcUkG3fyqcD-MHmN&autoplay=1&mute=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>

          {/* HARDCODED KALKULATOR BUTTON WITH FOLLOW GATE */}
          <button onClick={openFollowGate} className="block w-full text-left rounded-2xl bg-[#1c1c1e] border border-blue-900/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:bg-[#20242d] active:translate-y-0 active:scale-[0.98] p-5 shadow-sm relative overflow-hidden group">
              <div className="flex items-start gap-3 relative z-10">
                  <span className="text-2xl mt-0.5 flex-shrink-0">🧮</span>
                  <div>
                      <h2 className="text-[16px] font-semibold text-blue-400 mb-1.5 leading-snug group-hover:text-blue-300 transition-colors">
                          Kalkulator Backward Mapping UMKM
                      </h2>
                      <p className="text-[13px] text-gray-400/90 leading-relaxed">
                          Hitung target penjualan harian dan breakdown operasional warung/resto kamu di sini.
                      </p>
                  </div>
              </div>
          </button>

          {/* DYNAMIC LINKS FROM DB */}
          {links?.map((link) => (
            <a 
              key={link.id}
              href={link.url} 
              target="_blank" rel="noopener noreferrer"
              className="relative group block w-full rounded-2xl bg-[#1c1c1e] border border-gray-800 hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:bg-[#20242d] active:translate-y-0 active:scale-[0.98] p-5 shadow-sm overflow-hidden"
            >
              {link.is_highlight && (
                <div className="absolute -top-3 right-4 z-20">
                  <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-lg shadow-red-500/40 border-2 border-[#121212]">
                    ✨ Rekomendasi
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h2 className="text-[16px] font-semibold text-gray-200 mb-1 leading-snug group-hover:text-white transition-colors">
                    {link.title}
                  </h2>
                  {link.subtitle && <p className="text-[13px] text-gray-400/90 leading-relaxed">{link.subtitle}</p>}
                </div>
                <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">🚀</span>
              </div>
            </a>
          ))}
        </main>

        <footer className="mt-auto flex flex-col items-center w-full pt-8 pb-4 border-t border-gray-800/50">
          <p className="text-[11px] text-gray-500 text-center max-w-[280px] leading-relaxed">
            {profile?.footer_text || 'Powered by Antigravity.'}
          </p>
          <Link href="/admin/login" className="text-xs text-gray-700 hover:text-gray-400 mt-4 transition-colors">Login Admin</Link>
        </footer>
      </div>

      {/* MODAL FOLLOW GATE */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 px-4 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className={`bg-[#1a1a1c] border border-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl transition-transform duration-300 ${isModalOpen ? 'scale-100' : 'scale-95'}`}>
              
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Syarat Akses Kalkulator</h3>
                  <button onClick={closeFollowGate} className="text-gray-500 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
              </div>
              
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Kalkulator Backward Mapping 100% Gratis. Mohon dukung kami dengan mem-follow kedua akun Instagram di bawah ini untuk membuka akses:
              </p>

              <div className="space-y-3 mb-6">
                  {/* Akun 1 */}
                  <a href="#" onClick={clickedIg1}
                     className={`flex items-center justify-between w-full p-4 rounded-xl bg-[#252528] border transition-colors group ${hasClickedIg1 ? 'border-green-500' : 'border-gray-700 hover:border-orange-500'}`}>
                      <div className="flex items-center gap-3">
                          <span className="text-xl">📸</span>
                          <span className="font-semibold text-gray-200 group-hover:text-white">@baimdaily</span>
                      </div>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${hasClickedIg1 ? 'bg-green-500/20 text-white' : 'text-gray-500 bg-gray-800 group-hover:text-white'}`}>
                        {hasClickedIg1 ? '✅' : 'Cek'}
                      </span>
                  </a>

                  {/* Akun 2 */}
                  <a href="#" onClick={clickedIg2}
                     className={`flex items-center justify-between w-full p-4 rounded-xl bg-[#252528] border transition-colors group ${hasClickedIg2 ? 'border-green-500' : 'border-gray-700 hover:border-orange-500'}`}>
                      <div className="flex items-center gap-3">
                          <span className="text-xl">🍜</span>
                          <span className="font-semibold text-gray-200 group-hover:text-white">@warunkarsi.bekasi</span>
                      </div>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${hasClickedIg2 ? 'bg-green-500/20 text-white' : 'text-gray-500 bg-gray-800 group-hover:text-white'}`}>
                        {hasClickedIg2 ? '✅' : 'Cek'}
                      </span>
                  </a>
              </div>

              {/* Tombol Lanjut */}
              <a href="/kalkulator.html"
                 className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all duration-300 ${isUnlocked ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-gray-800 text-gray-500 pointer-events-none cursor-not-allowed'}`}>
                  {isUnlocked ? '🚀 Lanjutkan ke Kalkulator' : '🔒 Follow 2 Akun Untuk Lanjut'}
              </a>
          </div>
      </div>
    </div>
  )
}
