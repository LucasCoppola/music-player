import TracksTable from '@/components/main/tracks-table'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: TracksTable,
})
