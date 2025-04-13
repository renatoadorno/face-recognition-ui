import { Button } from "./ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { Link } from 'waku';

interface ResultModalProps {
  success: boolean,
  message?: string | null,
  data?: {
    name?: string
    cpf?: string
  }
  onClose: () => void
  onRetry?: () => void
}

export default function ResultModal({ success, data, message, onClose, onRetry }: ResultModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        {success ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Acesso Liberado</h3>

            {data && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium">Dados do usuário:</p>
                <p>Nome: {data.name}</p>
                <p>CPF: {data.cpf}</p>
              </div>
            )}

            <Button onClick={onClose} className="w-full">
              Fechar
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-red-700">{message ? 'Erro' : 'Acesso Negado'}</h3>
            <p className="text-gray-600">{message ? message : 'Não foi possível verificar sua identidade.'}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              {onRetry && (
                <Button onClick={onRetry} variant="outline" className="flex-1">
                  Tentar Novamente
                </Button>
              )}
              <Link to="/cadastro" className="flex-1">
                <Button className="w-full">Ir para Cadastro</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
