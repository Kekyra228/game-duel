import React, { useRef, useEffect } from "react";

const Canvas = ({ draw, width, height, onMouseMove, onClick }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrameId;

    const render = (currentTime) => {
      draw(context, currentTime);
      animationFrameId = requestAnimationFrame(render);
    };

    // Запуск отрисовки
    requestAnimationFrame(render);

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [draw, onMouseMove, onClick]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default Canvas;
