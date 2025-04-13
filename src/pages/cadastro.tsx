'use client';

import type React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Camera } from "lucide-react"
import CameraCapture from "../components/camera-capture"
import { apiService } from "../lib/api"
import { useRouter } from 'waku';
import ResultModal from "../components/result-modal"

export default function CadastroPage() {
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [errMessage, setErrMessage] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [imagemBase64, setImagemBase64] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleCapture = (imageData: string) => {
    setImagemBase64(imageData)
    setShowCamera(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome || !cpf || !imagemBase64) {
      console.log({
        title: "Erro no formulário",
        description: "Preencha todos os campos e capture uma imagem",
        variant: "destructive",
      });
      return
    }

    setIsLoading(true)

    try {
      const result = await apiService.register({
        nome,
        cpf,
        imagemBase64,
      })

      if (result.success) {
        setIsSuccess(true)
        setShowResult(true)
        // router.push("/login")
        console.log({
          title: "Cadastro realizado",
          description: "Seu cadastro foi realizado com sucesso",
        })
      } else {
        setIsSuccess(false)
        setErrMessage(result.message)
        setShowResult(true)
        console.log({
          title: "Erro no cadastro",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.log({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao processar seu cadastro",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="text-2xl font-bold text-center mb-6">Cadastro de Usuário</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e: { target: { value: string } }) => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={(e: { target: { value: string } }) => setCpf(formatCPF(e.target.value))}
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processando..." : "Cadastrar"}
          </Button>

          {showResult && (
            <ResultModal
              success={isSuccess}
              data={{}}
              message={errMessage}
              onClose={() => setShowResult(false)}
              onRetry={() => setShowResult(false)}
            />
          )}
        </form>
      </div>

      {showCamera && <CameraCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />}
    </main>
  )
}
