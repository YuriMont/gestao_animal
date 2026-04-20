import { Avatar } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/lib/utils'

function AvatarUI({
  className,
  ...props
}: React.ComponentProps<typeof Avatar.Root>) {
  return (
    <Avatar.Root
      data-slot="avatar"
      className={cn(
        'relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof Avatar.Image>) {
  return (
    <Avatar.Image
      data-slot="avatar-image"
      className={cn('aspect-square h-full w-full', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof Avatar.Fallback>) {
  return (
    <Avatar.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted flex h-full w-full items-center justify-center rounded-full text-xs font-medium',
        className
      )}
      {...props}
    />
  )
}

export { AvatarFallback, AvatarImage, AvatarUI as Avatar }
