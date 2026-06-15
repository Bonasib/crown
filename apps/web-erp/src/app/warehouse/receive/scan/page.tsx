'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { Button, Card, CardContent } from '@ronda/ui';

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setScanning(true);
        }
      } catch {
        setError('Camera access denied. Please allow camera access or enter the barcode manually.');
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function handleManual(e: React.FormEvent) {
    e.preventDefault();
    if (manualCode.trim()) {
      router.push(`/warehouse/receive?barcode=${encodeURIComponent(manualCode.trim())}`);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/warehouse/receive" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back to receive
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Scan barcode</h1>
      </div>

      <Card>
        <CardContent className="p-0 overflow-hidden rounded-lg">
          <div className="relative aspect-[4/3] bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />

            {/* Scan overlay */}
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-48 w-48">
                  {/* Corner brackets */}
                  <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-white" />
                  <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-white" />
                  <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-white" />
                  <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-white" />
                  {/* Scan line animation */}
                  <div className="absolute inset-x-0 top-1/2 h-0.5 animate-pulse bg-green-400/80" />
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 text-center">
                <div className="text-white">
                  <ScanLine className="mx-auto h-10 w-10 opacity-50" />
                  <p className="mt-2 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Point camera at a PRD or CTN barcode to scan.
      </p>

      {/* Manual fallback */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or type manually</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleManual} className="flex gap-2">
        <input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="PRD-… or CTN-…"
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button type="submit" disabled={!manualCode.trim()}>Use code</Button>
      </form>
    </div>
  );
}
