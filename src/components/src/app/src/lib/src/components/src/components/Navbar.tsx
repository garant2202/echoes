'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import AuthModal from './AuthModal'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  const openLoginModal = () => {
    setAuthMode('login')
    setAuthModalOpen(true)
  }

  const openRegisterModal = () => {
    setAuthMode('register')
    setAuthModalOpen(true)
  }

  return (
    <>
      <nav className="bg-gray-900/50 backdrop-blur-lg fixed w-full z-30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Echoes
            </Link>
            
            <div className="space-x-6 hidden md:flex">
              <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
                Можливості
              </Link>
              <Link href="/#pricing" className="text-gray-300 hover:text-white transition-colors">
                Ціни
              </Link>
              <Link href="/#demo" className="text-gray-300 hover:text-white transition-colors">
                Демо
              </Link>
            </div>
            
            <div>
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <Link href="/create" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Створити
                  </Link>
                  <div className="relative group">
                    <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
                      ) : (
                        <span className="text-white text-sm">{user.email?.charAt(0).toUpperCase()}</span>
                      )}
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="p-3 border-b border-gray-700">
                        <p className="text-white font-semibold truncate">{user.displayName || user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-colors">
                          Мої відлуння
                        </Link>
                        <Link href="/settings" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-colors">
                          Налаштування
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded transition-colors"
                        >
                          Вийти
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={openLoginModal}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    Увійти
                  </button>
                  <span className="text-gray-500">|</span>
                  <button
                    onClick={openRegisterModal}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Реєстрація
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode={authMode} 
      />
    </>
  )
}
