import { useNavigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { Leaf, Menu } from 'lucide-react'
import type * as React from 'react'
import { useEffect } from 'react'
import { isAuthenticatedAtom } from '@/atoms/auth'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { AppSidebar } from './app-sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-4 border-b bg-sidebar text-sidebar-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Leaf className="size-4 text-sidebar-primary-foreground" />
        </div>
        <span className="ml-2 text-lg font-bold">AgroGestão</span>
        <div className="ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-60">
              <AppSidebar mobile />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-16">{children}</main>
    </div>
  )
}
