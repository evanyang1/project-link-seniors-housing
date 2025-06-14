import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/createAccount')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/createAccount"!</div>
}
