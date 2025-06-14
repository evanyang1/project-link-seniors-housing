import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/portal')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/portal"!</div>
}
