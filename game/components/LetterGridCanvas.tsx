import { useEffect, useRef } from 'react';
import { Board } from '../canvas/board.tsx';

export const LetterGridCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    new Board(canvasRef.current!).draw();
  }, []);

  return (
    <div className="">
      <canvas ref={canvasRef} height={400} width={400} />
    </div>
  );
};
