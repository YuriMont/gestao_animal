import type * as React from 'react'
import { useState } from 'react'
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
import { useGetOrganizations } from '@/gen'
import { usePostAuthRegister } from '@/gen/hooks/authController/usePostAuthRegister'

export function RegisterForm() {
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    organizationId: '',
  })
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState('')

  const { data: organizations, isLoading: isLoadingOrganizations } =
    useGetOrganizations()

  const registerMutation = usePostAuthRegister({
    mutation: {
      onSuccess: () => {
        setRegSuccess('Conta criada com sucesso! Faça login.')
        setRegError('')
        setRegForm({ name: '', email: '', password: '', organizationId: '' })
      },
      onError: () => setRegError('Erro ao criar conta. Verifique os dados.'),
    },
  })

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegError('')
    setRegSuccess('')
    registerMutation.mutate({
      data: {
        name: regForm.name,
        email: regForm.email,
        password: regForm.password,
        organizationId: regForm.organizationId,
      },
    })
  }

  return (
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
              value={regForm.name}
              onChange={e => setRegForm({ ...regForm, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-email">E-mail</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="nome@empresa.com"
              value={regForm.email}
              onChange={e => setRegForm({ ...regForm, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-password">Senha</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={regForm.password}
              onChange={e => setRegForm({ ...regForm, password: e.target.value })}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reg-org">Organização</Label>
            <Select
              onValueChange={value => setRegForm({ ...regForm, organizationId: value })}
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
  )
}
