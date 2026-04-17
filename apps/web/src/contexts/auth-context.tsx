import type * as React from "react"
import { createContext, useCallback, useContext, useState } from "react"

type AuthUser = {
  id: string
  email: string
  name: string
  role: string
  organizationId: string
}

type AuthContextType = {
  user: AuthUser | null
  token: string | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function getStoredAuth(): { token: string | null; user: AuthUser | null } {
  try {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    const user = userStr ? (JSON.parse(userStr) as AuthUser) : null
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(getStoredAuth)

  const login = useCallback((token: string, user: AuthUser) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setAuth({ token, user })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setAuth({ token: null, user: null })
    window.location.href = "/login"
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        login,
        logout,
        isAuthenticated: !!auth.token && !!auth.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
