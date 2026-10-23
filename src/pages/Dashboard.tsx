import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, UserCheck, ShieldCheck, Mail, Calendar } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PromoEmblem } from '@/components/PromoEmblem'

export const Dashboard: React.FC = () => {
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#003366] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#5C6B7A]">Carregando sessão...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full min-h-screen flex flex-col bg-[#F5F7FA]">
      {/* Top Bar Institucional */}
      <header className="bg-[#003366] text-white px-6 sm:px-10 py-3.5 flex items-center justify-between border-b border-[#002244] shadow-sm">
        <div className="flex items-center gap-3">
          <PromoEmblem size={36} />
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-tight">Diretoria de Promoções</h1>
            <p className="text-xs text-white/70">Sistema interno de gestão</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </header>

      {/* Conteúdo do Painel Placeholder Mínimo */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col items-center justify-center">
        <div className="w-full bg-white rounded-xl border border-[#D1D9E6] shadow-sm p-8 sm:p-10 text-center max-w-lg animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#2E7D32]">
            <UserCheck className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#2E7D32] border border-emerald-200 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Autenticado com Sucesso
          </span>

          <h2 className="text-2xl font-bold text-[#1A2B3C] mb-2">Painel do Sistema</h2>
          <p className="text-sm text-[#5C6B7A] mb-6">
            Você acessou com sucesso o ambiente interno da Diretoria de Promoções.
          </p>

          <div className="bg-[#F5F7FA] rounded-lg p-4 text-left border border-[#D1D9E6] space-y-2.5 mb-6 text-sm text-[#1A2B3C]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5C6B7A]">
              Informações da Sessão
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <Mail className="w-4 h-4 text-[#003366] shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#003366] shrink-0" />
              <span className="text-xs text-[#5C6B7A]">
                Conectado em: {new Date().toLocaleDateString('pt-BR')} às{' '}
                {new Date().toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full h-10 px-4 rounded-md text-sm font-semibold text-white bg-[#003366] hover:bg-[#002244] transition-colors focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-2"
          >
            Encerrar Sessão
          </button>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
