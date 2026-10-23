import React, { useState } from 'react'
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface ForgotPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultEmail?: string
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  open,
  onOpenChange,
  defaultEmail = '',
}) => {
  const { resetPasswordForEmail } = useAuth()
  const [email, setEmail] = useState(defaultEmail)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  // Sync defaultEmail when modal opens
  React.useEffect(() => {
    if (open) {
      if (defaultEmail && !email) {
        setEmail(defaultEmail)
      }
      setSuccessMessage(null)
      setErrorMessage(null)
      setEmailError(null)
    }
  }, [open, defaultEmail])

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return 'Informe seu e-mail corporativo'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value.trim())) {
      return 'Informe um e-mail válido'
    }
    return null
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (emailError) {
      setEmailError(validateEmail(value))
    }
    if (errorMessage) {
      setErrorMessage(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) {
      setEmailError(err)
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const { error } = await resetPasswordForEmail(email.trim())
      if (error) {
        setErrorMessage(
          error.message.includes('rate limit')
            ? 'Muitas solicitações enviadas. Aguarde alguns instantes e tente novamente.'
            : 'Não foi possível enviar o link de recuperação. Verifique o e-mail informado.',
        )
      } else {
        setSuccessMessage(
          'Enviamos as orientações de redefinição para o seu e-mail. Verifique sua caixa de entrada e a pasta de spam.',
        )
      }
    } catch {
      setErrorMessage('Ocorreu um erro inesperado. Tente novamente mais tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] p-6 bg-white border-[#D1D9E6] shadow-xl rounded-lg">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl font-bold text-[#1A2B3C]">
            Recuperação de Senha
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5C6B7A] leading-relaxed">
            Informe o e-mail institucional cadastrado para receber o link de redefinição de acesso.
          </DialogDescription>
        </DialogHeader>

        {successMessage ? (
          <div className="py-4 space-y-4">
            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-[#2E7D32]">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-[#2E7D32]" />
              <p className="text-sm leading-relaxed">{successMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full h-11 px-4 rounded-md text-sm font-semibold text-white bg-[#003366] hover:bg-[#002244] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-2"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {errorMessage && (
              <div
                className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-md text-[#C62828] text-sm animate-fade-in"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#C62828]" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="recovery-email" className="block text-sm font-medium text-[#1A2B3C]">
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C6B7A]">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="seu@email.com.br"
                  autoFocus
                  disabled={isLoading}
                  className={`w-full h-11 pl-10 pr-3 rounded-md border text-base text-[#1A2B3C] placeholder:text-[#5C6B7A] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent ${
                    emailError ? 'border-[#C62828] focus:ring-[#C62828]' : 'border-[#D1D9E6]'
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-xs text-[#C62828] font-medium pt-0.5">{emailError}</p>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row-reverse gap-2">
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full sm:w-auto flex-1 h-11 px-4 rounded-md text-sm font-semibold text-white bg-[#003366] hover:bg-[#002244] transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Enviando link...</span>
                  </>
                ) : (
                  'Enviar link de recuperação'
                )}
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="w-full sm:w-auto h-11 px-4 rounded-md text-sm font-medium text-[#5C6B7A] hover:text-[#1A2B3C] hover:bg-[#F5F7FA] border border-[#D1D9E6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
