import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { Leaf } from 'lucide-react'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { isAuthenticatedAtom, loginAtom } from '@/atoms/auth'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetOrganizations } from '@/gen'
import { usePostAuthLogin } from '@/gen/hooks/authController/usePostAuthLogin'
import { usePostAuthRegister } from '@/gen/hooks/authController/usePostAuthRegister'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const login = useSetAtom(loginAtom)
  const navigate = useNavigate()

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regOrgId, setRegOrgId] = useState('')
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState('')

  const { data: organizations, isLoading: isLoadingOrganizations } =
    useGetOrganizations()

  useEffect(() => {
    if (isAuthenticated) navigate({ to: '/' })
  }, [isAuthenticated, navigate])

  const loginMutation = usePostAuthLogin({
    mutation: {
      onSuccess: res => {
        login({ token: res.token, user: res.user })
        navigate({ to: '/' })
      },
      onError: () => setLoginError('E-mail ou senha inválidos.'),
    },
  })

  const registerMutation = usePostAuthRegister({
    mutation: {
      onSuccess: () => {
        setRegSuccess('Conta criada com sucesso! Faça login.')
        setRegError('')
      },
      onError: () => setRegError('Erro ao criar conta. Verifique os dados.'),
    },
  })

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    loginMutation.mutate({
      data: { email: loginEmail, password: loginPassword },
    })
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegError('')
    setRegSuccess('')
    registerMutation.mutate({
      data: {
        name: regName,
        email: regEmail,
        password: regPassword,
        organizationId: regOrgId,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Leaf className="size-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AgroGestão</h1>
          <p className="text-sm text-muted-foreground">
            Gestão Animal Inteligente
          </p>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">
              Entrar
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1">
              Cadastrar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
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
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
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
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Criar conta</CardTitle>
                <CardDescription>
                  Cadastre-se com o ID da sua organização
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-name">Nome</Label>
                    <Input
                      id="reg-name"
                      placeholder="Seu nome"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email">E-mail</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="nome@empresa.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-password">Senha</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-org">Organização</Label>
                    <Select
                      onValueChange={value => setRegOrgId(value)}
                      disabled={isLoadingOrganizations}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Organização" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {organizations?.data.map(item => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {regError && (
                    <p className="text-sm text-destructive">{regError}</p>
                  )}
                  {regSuccess && (
                    <p className="text-sm text-primary">{regSuccess}</p>
                  )}
                </CardContent>
                <CardFooter className="mt-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending
                      ? 'Cadastrando...'
                      : 'Criar conta'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
