import { useNavigate } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import type * as React from 'react'
import { useState } from 'react'
import { loginAtom } from '@/atoms/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePostAuthLogin } from '@/gen/hooks/authController/usePostAuthLogin'

export function LoginForm() {
  const login = useSetAtom(loginAtom)
  const navigate = useNavigate()

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [loginError, setLoginError] = useState('')

  const loginMutation = usePostAuthLogin({
    mutation: {
      onSuccess: res => {
        login({ token: res.token, user: res.user })
        navigate({ to: '/' })
      },
      onError: () => setLoginError('E-mail ou senha inválidos.'),
    },
  })

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    loginMutation.mutate({
      data: { email: loginForm.email, password: loginForm.password },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bem-vindo de volta</CardTitle>
        <CardDescription>
          Entre com sua conta para continuar
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@empresa.com"
              value={loginForm.email}
              onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
          </div>
          {loginError && (
            <p className="text-sm text-destructive">{loginError}</p>
          )}
        </CardContent>
        <CardFooter className="mt-3">
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
