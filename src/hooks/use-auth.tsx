import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

const REMEMBER_ME_KEY = 'dp_remember_me'

interface AuthContextType {
  user: User | null
  session: Session | null
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>
  updateUserPassword: (password: string) => Promise<{ error: Error | null }>
  rememberMe: boolean
  setRememberMe: (value: boolean) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [rememberMe, setRememberMeState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(REMEMBER_ME_KEY)
      return stored !== null ? stored === 'true' : true
    } catch {
      return true
    }
  })

  const setRememberMe = (value: boolean) => {
    setRememberMeState(value)
    try {
      localStorage.setItem(REMEMBER_ME_KEY, String(value))
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    // Check if session was non-persistent from a previous tab close
    try {
      const isRemember = localStorage.getItem(REMEMBER_ME_KEY) === 'true'
      const hasActiveSession = sessionStorage.getItem('dp_session_active') === 'true'
      if (!isRemember && !hasActiveSession) {
        // If not remembering and browser/tab session was closed, clear session
        supabase.auth.signOut()
      }
    } catch {
      // ignore
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      // FORBIDDEN: no async/await inside this callback — sync only
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_IN') {
        try {
          sessionStorage.setItem('dp_session_active', 'true')
        } catch {
          // ignore
        }
      } else if (event === 'SIGNED_OUT') {
        try {
          sessionStorage.removeItem('dp_session_active')
        } catch {
          // ignore
        }
      }
    })

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string, shouldRemember = true) => {
    setRememberMe(shouldRemember)
    try {
      if (shouldRemember) {
        sessionStorage.setItem('dp_session_active', 'true')
      } else {
        sessionStorage.setItem('dp_session_active', 'true')
      }
    } catch {
      // ignore
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { error }
    }
    if (data.session) {
      setSession(data.session)
      setUser(data.session.user)
    }
    return { error: null }
  }

  const signOut = async () => {
    try {
      sessionStorage.removeItem('dp_session_active')
    } catch {
      // ignore
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPasswordForEmail = async (email: string) => {
    const redirectUrl = `${window.location.origin}/recuperar-senha`
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })
    return { error }
  }

  const updateUserPassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signIn,
        signOut,
        resetPasswordForEmail,
        updateUserPassword,
        rememberMe,
        setRememberMe,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
