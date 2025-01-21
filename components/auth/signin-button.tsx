import { signIn } from "@/auth"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("Credentials", { redirectTo: "/" })
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  )
}