import { useState, useRef, useCallback } from 'react';
import { Camera, Square, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FaceRecognitionProps {
  onCapture: (photoData: string) => void;
  onClose: () => void;
  studentName?: string;
}

export const FaceRecognition = ({ onCapture, onClose, studentName }: FaceRecognitionProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCapturing(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please allow camera permissions.');
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(photoData);
      }
    }
  }, []);

  const confirmCapture = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      stopCamera();
      onClose();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Face Recognition Capture</h3>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {studentName && (
          <p className="text-muted-foreground mb-4">Capturing attendance for: {studentName}</p>
        )}

        <div className="space-y-4">
          {!isCapturing && !capturedPhoto && (
            <div className="text-center py-8">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Position your face in the camera frame and ensure good lighting
              </p>
              <Button onClick={startCamera}>
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            </div>
          )}

          {isCapturing && !capturedPhoto && (
            <div className="relative">
              <div className="face-recognition-frame aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="camera-overlay">
                  <div className="absolute inset-4 border-2 border-white/50 rounded-full flex items-center justify-center">
                    <Square className="h-8 w-8 text-white/70" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={capturePhoto}>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </div>
            </div>
          )}

          {capturedPhoto && (
            <div className="text-center">
              <div className="inline-block relative rounded-lg overflow-hidden border-2 border-border">
                <img 
                  src={capturedPhoto} 
                  alt="Captured face" 
                  className="w-64 h-64 object-cover"
                />
              </div>
              
              <div className="flex justify-center gap-4 mt-4">
                <Button variant="outline" onClick={retakePhoto}>
                  Retake
                </Button>
                <Button onClick={confirmCapture} className="bg-success text-success-foreground">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </Card>
    </div>
  );
};