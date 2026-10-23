import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PromoEmblem } from '@/components/PromoEmblem'
import { ForgotPasswordModal } from '@/components/ForgotPasswordModal'
import { Checkbox } from '@/components/ui/checkbox'

export const Index: React.FC = () => {
  const { user, loading: authLoading, signIn, rememberMe, setRememberMe } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forgotModalOpen, setForgotModalOpen] = useState(false)

  // Redireciona imediatamente se já houver sessão ativa
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, authLoading, navigate])

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) {
      return null
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value.trim())) {
      return 'Informe um e-mail válido'
    }
    return null
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setEmail(val)
    if (authError) setAuthError(null)
    setEmailError(validateEmail(val))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (authError) setAuthError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const emailErr = validateEmail(email)
    if (emailErr) {
      setEmailError(emailErr)
      return
    }

    if (!email.trim() || !password) {
      setAuthError('Preencha todos os campos para continuar.')
      return
    }

    setIsSubmitting(true)
    setAuthError(null)

    try {
      const { error } = await signIn(email.trim(), password, rememberMe)
      if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
          setAuthError('E-mail ou senha incorretos')
        } else if (msg.includes('email not confirmed')) {
          setAuthError('E-mail ainda não confirmado. Verifique sua caixa de entrada.')
        } else {
          setAuthError('E-mail ou senha incorretos')
        }
        setIsSubmitting(false)
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch {
      setAuthError('Ocorreu um erro ao tentar acessar. Tente novamente.')
      setIsSubmitting(false)
    }
  }

  const isFormValid = email.trim().length > 0 && password.length > 0 && !emailError

  return (
    <div className="flex-1 w-full min-h-screen flex flex-col sm:flex-row bg-[#F5F7FA]">
      {/* PAINEL ESQUERDO: Marca e Identidade Institucional
          Desktop: 45% largura
          Tablet: 35% largura
          Mobile: faixa compacta no topo (~120px)
      */}
      <aside className="w-full sm:w-[35%] lg:w-[45%] bg-gradient-to-br from-[#003366] via-[#002b54] to-[#001f3f] text-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative overflow-hidden shrink-0 border-b sm:border-b-0 sm:border-r border-[#002244]">
        {/* Subtle decorative background watermarks */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/[0.03] blur-2xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#004080]/30 blur-3xl pointer-events-none"
        />

        {/* Mobile Header View (Compact ~120px) */}
        <div className="sm:hidden flex items-center justify-center gap-3.5 py-2">
          <PromoEmblem size={44} className="shrink-0 drop-shadow-md" />
          <div className="text-left">
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              Diretoria de Promoções
            </h1>
            <p className="text-xs text-white/75 font-normal">Sistema interno de gestão</p>
          </div>
        </div>

        {/* Desktop / Tablet Brand Panel Content */}
        <div className="hidden sm:flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-white/90 uppercase tracking-widest font-semibold">
            <span>Uso Restrito e Interno</span>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-start my-auto py-8">
          <div className="p-3 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-sm shadow-inner mb-6">
            <PromoEmblem size={72} className="drop-shadow-lg" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2 leading-tight">
            Diretoria de Promoções
          </h1>
          <div className="h-1 w-16 bg-[#D4AF37] rounded-full mb-4" />
          <p className="text-sm lg:text-base text-white/80 font-normal leading-relaxed max-w-sm">
            Sistema interno de gestão e controle de promoções funcionais.
          </p>
        </div>

        <div className="hidden sm:flex flex-col gap-1 pt-4 border-t border-white/10 text-xs text-white/60">
          <span>Ambiente corporativo seguro e monitorado.</span>
          <span>Acesso restrito a servidores autorizados.</span>
        </div>
      </aside>

      {/* PAINEL DIREITO: Área do Formulário
          Desktop: 55% largura
          Tablet: 65% largura
          Mobile: restante da tela
      */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-white sm:bg-[#F5F7FA]">
        <div
          className="w-full max-w-[420px] bg-white sm:p-8 sm:rounded-xl sm:border sm:border-[#D1D9E6] sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in-up"
          style={{ animationDuration: '400ms', animationTimingFunction: 'ease-out' }}
        >
          {/* Header do Formulário */}
          <header className="mb-6">
            <h2 className="text-[28px] font-bold text-[#1A2B3C] tracking-tight leading-tight">
              Acessar o sistema
            </h2>
            <p className="text-[16px] text-[#5C6B7A] mt-1.5 leading-normal">
              Informe suas credenciais para continuar
            </p>
          </header>

          {/* Área de Erro Global */}
          {authError && (
            <div
              className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-[#C62828]/25 rounded-md text-[#C62828] text-sm animate-fade-in"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-[#C62828]" />
              <div className="leading-snug font-medium">{authError}</div>
            </div>
          )}

          {/* Formulário de Login */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Campo E-mail */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-[14px] font-medium text-[#1A2B3C]">
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C6B7A]">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="seu@email.com.br"
                  disabled={isSubmitting}
                  className={`w-full h-11 pl-10 pr-3 rounded-md border text-[16px] text-[#1A2B3C] placeholder:text-[#5C6B7A] bg-white transition-all focus:outline-none focus:ring-2 ${
                    emailError
                      ? 'border-[#C62828] focus:ring-[#C62828]'
                      : 'border-[#D1D9E6] focus:ring-[#003366] focus:border-transparent'
                  }`}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error-msg' : undefined}
                />
              </div>
              {emailError && (
                <p id="email-error-msg" className="text-xs text-[#C62828] font-medium pt-0.5">
                  {emailError}
                </p>
              )}
            </div>

            {/* Campo Senha */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-[14px] font-medium text-[#1A2B3C]"
              >
                Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C6B7A]">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full h-11 pl-10 pr-10 rounded-md border border-[#D1D9E6] text-[16px] text-[#1A2B3C] placeholder:text-[#5C6B7A] bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5C6B7A] hover:text-[#1A2B3C] transition-colors focus:outline-none focus:text-[#003366]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Opções extras: Lembrar de mim e Esqueci minha senha */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-[#D1D9E6] data-[state=checked]:bg-[#003366] data-[state=checked]:border-[#003366]"
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-[#1A2B3C] cursor-pointer select-none font-normal"
                >
                  Lembrar de mim
                </label>
              </div>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-sm font-medium text-[#003366] hover:text-[#002244] hover:underline transition-colors focus:outline-none focus:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Botão Primário "Entrar" */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full h-11 px-4 rounded-md text-[16px] font-semibold text-white bg-[#003366] hover:bg-[#002244] hover:shadow-[0_4px_12px_rgba(0,51,102,0.2)] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>

          {/* Dica de acesso institucional para auxílio do operador */}
          <div className="mt-8 pt-4 border-t border-[#D1D9E6] text-center">
            <p className="text-xs text-[#5C6B7A]">
              Dúvidas ou problemas com o acesso? Contate o suporte da Diretoria.
            </p>
          </div>
        </div>
      </main>

      {/* Modal de Recuperação de Senha */}
      <ForgotPasswordModal
        open={forgotModalOpen}
        onOpenChange={setForgotModalOpen}
        defaultEmail={email}
      />
    </div>
  )
}

export default Index
