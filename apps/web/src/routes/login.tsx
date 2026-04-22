import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { Leaf } from 'lucide-react'
import { useEffect } from 'react'
import { isAuthenticatedAtom } from '@/atoms/auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate({ to: '/' })
  }, [isAuthenticated, navigate])

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
            <LoginForm />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
