import React, { useRef, useEffect } from "react";

const Canvas = ({ draw, width, height, onClick }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const render = (currentTime) => {
      draw(context, currentTime);
      requestAnimationFrame(render);
    };

    render(performance.now());

    canvas.addEventListener("click", onClick);
    return () => {
      canvas.removeEventListener("click", onClick);
    };
  }, [draw, onClick]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default Canvas;
