import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PromoEmblem } from '@/components/PromoEmblem'
import { supabase } from '@/lib/supabase/client'

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { updateUserPassword } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null)

  // Verificar se o usuário acessou por um link válido de recuperação (Supabase injeta a sessão ou hash)
  useEffect(() => {
    const checkSession = async () => {
      // 1. Tenta recuperar sessão existente ou que o supabase processou da URL hash
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        setHasValidSession(true)
        return
      }

      // 2. Se a URL tem o fragmento hash (#access_token=...&type=recovery), escuta o evento de troca de autenticação
      const hash = window.location.hash
      if (hash && (hash.includes('access_token') || hash.includes('type=recovery'))) {
        // Aguarda um instante para o cliente do Supabase processar a URL
        const timer = setTimeout(async () => {
          const { data } = await supabase.auth.getSession()
          setHasValidSession(!!data.session)
        }, 800)
        return () => clearTimeout(timer)
      }

      // Se não há sessão nem hash de recuperação
      setHasValidSession(false)
    }

    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    if (!password || !confirmPassword) {
      setErrorMessage('Preencha os dois campos de senha.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('A nova senha deve possuir pelo menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas informadas não conferem.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await updateUserPassword(password)
      if (error) {
        setErrorMessage(
          error.message.includes('same_password')
            ? 'A nova senha deve ser diferente da anterior.'
            : 'Não foi possível redefinir a senha. O link pode ter expirado.',
        )
      } else {
        setSuccess(true)
      }
    } catch {
      setErrorMessage('Ocorreu um erro ao redefinir a senha. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 w-full min-h-screen flex flex-col bg-[#F5F7FA]">
      {/* Faixa Superior Institucional */}
      <header className="w-full bg-gradient-to-r from-[#003366] to-[#002244] text-white py-4 px-6 sm:px-10 flex items-center justify-between border-b border-[#001f3f] shadow-sm">
        <div className="flex items-center gap-3">
          <PromoEmblem size={36} />
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-tight">Diretoria de Promoções</h1>
            <p className="text-xs text-white/70">Redefinição de Acesso Seguro</p>
          </div>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao login</span>
        </Link>
      </header>

      {/* Conteúdo Central */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div
          className="w-full max-w-[420px] bg-white p-8 rounded-xl border border-[#D1D9E6] shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in-up"
          style={{ animationDuration: '400ms' }}
        >
          <header className="mb-6">
            <h2 className="text-[26px] font-bold text-[#1A2B3C] tracking-tight leading-tight">
              Nova Senha
            </h2>
            <p className="text-sm text-[#5C6B7A] mt-1.5 leading-normal">
              Crie uma nova senha de acesso institucional.
            </p>
          </header>

          {/* Validação de link de recuperação */}
          {hasValidSession === false && (
            <div
              className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-sm space-y-3 mb-4"
              role="alert"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong>Link inválido ou expirado.</strong>
                  <p className="mt-1 text-xs text-amber-800">
                    O link de recuperação pode ter expirado ou já foi utilizado. Solicite um novo
                    link na página de login.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full h-9 rounded-md text-xs font-semibold text-[#003366] bg-amber-100 hover:bg-amber-200 transition-colors"
              >
                Voltar para o Login
              </button>
            </div>
          )}

          {success ? (
            <div className="space-y-4 py-2">
              <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-md text-[#2E7D32]">
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-[#2E7D32]" />
                <div className="text-sm leading-relaxed">
                  <p className="font-semibold">Senha alterada com sucesso!</p>
                  <p className="mt-1 text-xs text-emerald-800">
                    Sua nova credencial já está ativa no sistema da Diretoria de Promoções.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/', { replace: true })}
                className="w-full h-11 px-4 rounded-md text-sm font-semibold text-white bg-[#003366] hover:bg-[#002244] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-2"
              >
                Ir para o Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div
                  className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-md text-[#C62828] text-sm animate-fade-in"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#C62828]" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Campo Nova Senha */}
              <div className="space-y-1.5">
                <label
                  htmlFor="new-password"
                  className="block text-[14px] font-medium text-[#1A2B3C]"
                >
                  Nova Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C6B7A]">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    disabled={isLoading || hasValidSession === false}
                    className="w-full h-11 pl-10 pr-10 rounded-md border border-[#D1D9E6] text-base text-[#1A2B3C] placeholder:text-[#5C6B7A] bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5C6B7A] hover:text-[#1A2B3C] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Campo Confirmar Senha */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirm-password"
                  className="block text-[14px] font-medium text-[#1A2B3C]"
                >
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C6B7A]">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    disabled={isLoading || hasValidSession === false}
                    className="w-full h-11 pl-10 pr-10 rounded-md border border-[#D1D9E6] text-base text-[#1A2B3C] placeholder:text-[#5C6B7A] bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ocultar confirmação' : 'Exibir confirmação'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5C6B7A] hover:text-[#1A2B3C] transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botão Salvar Senha */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword || hasValidSession === false}
                  className="w-full h-11 px-4 rounded-md text-[16px] font-semibold text-white bg-[#003366] hover:bg-[#002244] hover:shadow-[0_4px_12px_rgba(0,51,102,0.2)] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Salvando nova senha...</span>
                    </>
                  ) : (
                    'Salvar nova senha'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export default ResetPasswordPage
