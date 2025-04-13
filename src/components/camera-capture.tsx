"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Camera, X } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onClose: () => void
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }

        setStream(mediaStream)
        setError(null)
      } catch (err) {
        setError("Não foi possível acessar a câmera. Verifique as permissões do navegador.")
        console.error("Erro ao acessar a câmera:", err)
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current video frame to the canvas
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to base64 image
        const imageData = canvas.toDataURL("image/jpeg")
        onCapture(imageData)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Capturar Imagem</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : (
          <>
            <div className="relative bg-gray-100 rounded-md overflow-hidden h-[400px] mb-4">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex justify-center">
              <Button onClick={captureImage} className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                <span>Capturar</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
