import { useRef, useState } from "react";
import "./App.css";

const initialSpeed = 30; // Initial velocity
const friction = 0.005; // Friction
const minSpeed = 0.5; // Minimum speed to stop

const App = () => {
  const ballRef = useRef(null);
  const canvasRef = useRef(null);
  const velocity = useRef({ x: 0, y: 0 });
  const animationId = useRef(null);
  const [isBallStopped, setIsBallStopped] = useState(true);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const ball = ballRef.current;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const ballX = ball.offsetLeft + ball.offsetWidth / 2;
    const ballY = ball.offsetTop + ball.offsetHeight / 2;

    const dx = clickX - ballX;
    const dy = clickY - ballY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    velocity.current = {
      x: (dx / distance) * initialSpeed,
      y: (dy / distance) * initialSpeed,
    };

    if (!animationId.current) moveBall();
  };

  const moveBall = () => {
    setIsBallStopped(false);
    const ball = ballRef.current;
    const canvas = canvasRef.current;
    const maxX = canvas.offsetWidth - ball.offsetWidth;
    const maxY = canvas.offsetHeight - ball.offsetHeight;

    const animate = () => {
      let { x: vx, y: vy } = velocity.current;
      const x = ball.offsetLeft + vx;
      const y = ball.offsetTop + vy;

      if (x <= 0 || x >= maxX) vx = -vx;
      if (y <= 0 || y >= maxY) vy = -vy;

      vx *= 1 - friction;
      vy *= 1 - friction;

      velocity.current = { x: vx, y: vy };

      if (Math.abs(vx) < minSpeed && Math.abs(vy) < minSpeed) {
        velocity.current = { x: 0, y: 0 };
        setIsBallStopped(true);
        animationId.current = null;
        return;
      }

      ball.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
      ball.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
      animationId.current = requestAnimationFrame(animate);
    };

    animationId.current = requestAnimationFrame(animate);
  };

  return (
    <div id="canvas" ref={canvasRef} onClick={handleClick}>
      <div id="ball" ref={ballRef}></div>
      {isBallStopped && <div id="instructions">Click to launch the ball!</div>}
    </div>
  );
};

export default App;
