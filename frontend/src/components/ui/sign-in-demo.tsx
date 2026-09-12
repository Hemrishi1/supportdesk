import { SignIn6 } from '@/components/ui/sign-in-6'

export default function SignInDemo({ onSuccess }: { onSuccess?: (email: string) => void }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 md:p-8 bg-[#090d16]">
      <div className="w-full max-w-3xl">
        <SignIn6 onSuccess={onSuccess} />
      </div>
    </div>
  )
}
