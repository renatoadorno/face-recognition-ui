'use client';

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Camera } from "lucide-react"
import CameraCapture from "../components/camera-capture"
import ResultModal from "../components/result-modal"
import { apiService } from "../lib/api"
import { Link } from 'waku';

export default function LoginPage() {
  const [imagemBase64, setImagemBase64] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [userData, setUserData] = useState<{ nome?: string; cpf?: string }>({})

  const handleCapture = (imageData: string) => {
    setImagemBase64(imageData)
    setShowCamera(false)
  }

  const handleVerify = async () => {
    if (!imagemBase64) return

    setIsLoading(true)

    try {
      const result = await apiService.login({
        imagemBase64,
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
    setShowCamera(true)
    setImagemBase64(null)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login com Reconhecimento Facial</h1>

        <div className="space-y-4">
          {!showCamera && imagemBase64 ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imagemBase64 || "/placeholder.svg"}
                  alt="Imagem capturada"
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowCamera(true)}>
                  Recapturar
                </Button>
                <Button className="flex-1" onClick={handleVerify} disabled={isLoading}>
                  {isLoading ? "Verificando..." : "Verificar"}
                </Button>
              </div>
            </div>
          ) : !showCamera ? (
            <Button
              className="w-full h-64 flex flex-col items-center justify-center gap-2"
              onClick={() => setShowCamera(true)}
            >
              <Camera className="h-8 w-8" />
              <span>Capturar Imagem</span>
            </Button>
          ) : null}

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
