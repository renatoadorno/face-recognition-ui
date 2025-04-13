'use client';

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Camera } from "lucide-react"
import CameraCapture from "../components/camera-capture"
import ResultModal from "../components/result-modal"
import { apiService } from "../lib/api"
import { Link } from 'waku';

export default function LoginReferenciaPage() {
  const [cpf, setCpf] = useState("")
  const [imagemBase64, setImagemBase64] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [userData, setUserData] = useState<{ nome?: string; cpf?: string }>({})

  const handleCapture = (imageData: string) => {
    setImagemBase64(imageData)
    setShowCamera(false)
  }

  const handleVerify = async () => {
    if (!imagemBase64 || !cpf) return

    setIsLoading(true)

    try {
      const result = await apiService.loginWithReference({
        imagemBase64,
        cpf,
      })

      setLoginSuccess(result.success)
      if (result.success && result.data) {
        setUserData(result.data)
      }
      setShowResult(true)
    } catch (error) {
      setLoginSuccess(false)
      setShowResult(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setShowResult(false)
    setImagemBase64(null)
  }

  // Função para formatar o CPF enquanto o usuário digita
  const formatCPF = (value: string) => {
    // Remove todos os caracteres não numéricos
    const cpfNumbers = value.replace(/\D/g, "")

    // Limita a 11 dígitos
    const cpfLimited = cpfNumbers.slice(0, 11)

    // Formata o CPF (XXX.XXX.XXX-XX)
    let formattedCPF = cpfLimited
    if (cpfLimited.length > 3) {
      formattedCPF = cpfLimited.replace(/^(\d{3})(\d)/, "$1.$2")
    }
    if (cpfLimited.length > 6) {
      formattedCPF = formattedCPF.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    }
    if (cpfLimited.length > 9) {
      formattedCPF = formattedCPF.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
    }

    return formattedCPF
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login com Referência</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              placeholder="000.000.000-00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Imagem Facial</Label>
            {imagemBase64 ? (
              <div className="relative">
                <img
                  src={imagemBase64 || "/placeholder.svg"}
                  alt="Imagem capturada"
                  className="w-full h-48 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={() => setShowCamera(true)}
                >
                  Recapturar
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-48 flex flex-col items-center justify-center gap-2"
                onClick={() => setShowCamera(true)}
              >
                <Camera className="h-8 w-8" />
                <span>Capturar Imagem</span>
              </Button>
            )}
          </div>

          <Button className="w-full" onClick={handleVerify} disabled={isLoading || !cpf || !imagemBase64}>
            {isLoading ? "Verificando..." : "Verificar"}
          </Button>

          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>

      {showCamera && <CameraCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />}

      {showResult && (
        <ResultModal
          success={loginSuccess}
          data={userData}
          onClose={() => setShowResult(false)}
          onRetry={handleRetry}
        />
      )}
    </main>
  )
}
