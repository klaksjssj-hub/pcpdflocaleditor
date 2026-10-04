import React, { useRef, useState, useEffect } from 'react';
import { Pen, Type, Image, Trash2, Check } from 'lucide-react';

interface SignaturePadProps {
  onSignatureReady: (dataUrl: string) => void;
  onCancel?: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureReady,
  onCancel,
}) => {
  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (tab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = penColor;
          ctx.lineWidth = penWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        }
      }
    }
  }, [tab, penColor, penWidth]);

  // Drawing canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Convert typed signature to canvas data URL
  const generateTypedDataUrl = (text: string, fontStyle: string): string => {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 400;
    offCanvas.height = 120;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return '';

    ctx.font = fontStyle;
    ctx.fillStyle = penColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text || 'Your Signature', 200, 60);

    return offCanvas.toDataURL('image/png');
  };

  const handleSave = () => {
    if (tab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      onSignatureReady(canvas.toDataURL('image/png'));
    } else if (tab === 'type') {
      const dataUrl = generateTypedDataUrl(typedName || 'Signer', 'italic 40px "Brush Script MT", cursive, sans-serif');
      onSignatureReady(dataUrl);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSignatureReady(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Create E-Signature
        </h3>

        {/* Mode tabs */}
        <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setTab('draw')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              tab === 'draw'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500'
            }`}
          >
            <Pen className="h-3 w-3" /> Draw
          </button>
          <button
            onClick={() => setTab('type')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              tab === 'type'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500'
            }`}
          >
            <Type className="h-3 w-3" /> Type
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              tab === 'upload'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500'
            }`}
          >
            <Image className="h-3 w-3" /> Upload
          </button>
        </div>
      </div>

      <div className="mt-4">
        {/* Draw Mode */}
        {tab === 'draw' && (
          <div>
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40">
              <canvas
                ref={canvasRef}
                width={450}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full cursor-crosshair touch-none"
              />
              <div className="pointer-events-none absolute bottom-2 left-4 text-[10px] text-slate-400">
                Sign above this line
              </div>
              <div className="pointer-events-none absolute bottom-6 left-4 right-4 border-b border-dashed border-slate-300 dark:border-slate-600" />
            </div>

            {/* Pen controls */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Color:</span>
                {['#000000', '#1d4ed8', '#b91c1c'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setPenColor(color)}
                    className={`h-5 w-5 rounded-full border-2 ${
                      penColor === color ? 'border-slate-400 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <button
                onClick={clearCanvas}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </div>
        )}

        {/* Type Mode */}
        {tab === 'type' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Type your name..."
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800"
            />

            <div className="flex h-28 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
              <span
                style={{
                  fontFamily: '"Brush Script MT", cursive, sans-serif',
                  fontSize: '36px',
                  color: penColor,
                  fontStyle: 'italic',
                }}
              >
                {typedName || 'Your Signature'}
              </span>
            </div>
          </div>
        )}

        {/* Upload Mode */}
        {tab === 'upload' && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-8 text-center dark:border-slate-700">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageUpload}
              className="hidden"
              id="sig-upload"
            />
            <label
              htmlFor="sig-upload"
              className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
            >
              Choose Signature Image
            </label>
            <span className="mt-2 text-[11px] text-slate-400">PNG or JPG transparent background recommended</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        {onCancel && (
          <button
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
        {tab !== 'upload' && (
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 active:scale-95"
          >
            <Check className="h-4 w-4" /> Apply Signature
          </button>
        )}
      </div>
    </div>
  );
};
