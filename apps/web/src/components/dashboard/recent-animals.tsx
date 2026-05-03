import { Beef } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetV1Animals } from '@/gen/hooks/animalsController/useGetV1Animals'
import { getEnumLabel } from '@/lib/enum-labels'

function statusBadgeVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline' {
  const variants: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'
  > = {
    ACTIVE: 'success',
    INACTIVE: 'warning',
    QUARANTINE: 'warning',
    SOLD: 'secondary',
    DECEASED: 'destructive',
  }
  return variants[status] ?? 'outline'
}

export function RecentAnimals() {
  const animalsQuery = useGetV1Animals({ limit: 10, page: 1 })
  const animals = animalsQuery.data?.data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Animais Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {animalsQuery.isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : animals.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Beef className="size-8 opacity-30" />
            <p className="text-sm">Nenhum animal cadastrado</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Espécie</TableHead>
                <TableHead>Raça</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animals.map(animal => (
                <TableRow key={animal.id}>
                  <TableCell className="font-mono font-medium">
                    {animal.tag}
                  </TableCell>
                  <TableCell>{getEnumLabel('species', animal.species)}</TableCell>
                  <TableCell>{animal.breedName ?? '—'}</TableCell>
                  <TableCell>
                    {getEnumLabel('animalSex', animal.sex)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(animal.status)}>
                      {getEnumLabel('animalStatus', animal.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
