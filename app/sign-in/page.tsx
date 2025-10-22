import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Sudoku Squad</h1>
          <p className="mt-2 text-muted-foreground">Track your PRs, compete with friends</p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}
