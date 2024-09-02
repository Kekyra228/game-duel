import React, { useState, useCallback, useRef, useEffect } from "react";
import Hero from "./components/Hero";
import Canvas from "./components/Canvas";

const App = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const [width] = useState(1900);
  const [height] = useState(800);

  //управление видимостью меню и выбранным героем
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);

  const [hero1Settings, setHero1Settings] = useState({
    color: "red",
    speed: 2.5,
    fireRate: 1500, //интервал выстрела
  });
  const [hero2Settings, setHero2Settings] = useState({
    color: "blue",
    speed: 4,
    fireRate: 1000,
  });

  const hero1 = useRef(
    new Hero(
      100,
      height / 2,
      30,
      hero1Settings.color,
      hero1Settings.speed,
      hero1Settings.fireRate
    )
  );
  const hero2 = useRef(
    new Hero(
      width - 100,
      height / 2,
      30,
      hero2Settings.color,
      hero2Settings.speed,
      hero2Settings.fireRate
    )
  );

  useEffect(() => {
    hero1.current.color = hero1Settings.color;
    hero1.current.dy = hero1Settings.speed;
    hero1.current.fireRate = hero1Settings.fireRate;

    hero2.current.color = hero2Settings.color;
    hero2.current.dy = hero2Settings.speed;
    hero2.current.fireRate = hero2Settings.fireRate;
  }, [hero1Settings, hero2Settings]);

  //фун-я для сохранения координат мыши для изменения движения героя
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const canvasRect = event.target.getBoundingClientRect();
    const offsetX = clientX - canvasRect.left;
    const offsetY = clientY - canvasRect.top;
    setMousePosition({ x: offsetX, y: offsetY });
  };

  const handleMouseClick = (event) => {
    const canvasRect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - canvasRect.left;
    const offsetY = event.clientY - canvasRect.top;

    if (
      Math.hypot(offsetX - hero1.current.x, offsetY - hero1.current.y) <
      hero1.current.radius
    ) {
      setSelectedHero(hero1.current);
      setMenuVisible(true);
    } else if (
      Math.hypot(offsetX - hero2.current.x, offsetY - hero2.current.y) <
      hero2.current.radius
    ) {
      setSelectedHero(hero2.current);
      setMenuVisible(true);
    }
  };

  //отрисовка и обновление героев
  const draw = useCallback(
    (context, currentTime) => {
      context.clearRect(0, 0, width, height);

      hero1.current.move(height, mousePosition);
      hero2.current.move(height, mousePosition);

      hero1.current.updateSpells(width);
      hero2.current.updateSpells(width);

      hero1.current.shoot(currentTime, hero2.current);
      hero2.current.shoot(currentTime, hero1.current);

      hero1.current.draw(context);
      hero2.current.draw(context);
    },
    [width, height, mousePosition]
  );

  return (
    <div>
      <Canvas
        draw={draw}
        width={width}
        height={height}
        onClick={handleMouseClick}
        onMouseMove={handleMouseMove}
      />
      {menuVisible && selectedHero && (
        <div className="menu">
          <h2>Настройки для героя</h2>
          <label>
            Цвет:
            <input
              type="color"
              value={selectedHero.color}
              onChange={(e) => {
                const newColor = e.target.value;
                if (selectedHero === hero1.current) {
                  setHero1Settings((prev) => ({ ...prev, color: newColor }));
                } else if (selectedHero === hero2.current) {
                  setHero2Settings((prev) => ({ ...prev, color: newColor }));
                }
                setMenuVisible(false);
              }}
            />
          </label>
          <label>
            Скорость:
            <input
              type="range"
              min="1"
              max="10"
              value={selectedHero.dy}
              onChange={(e) => {
                const newSpeed = parseInt(e.target.value, 10);
                if (selectedHero === hero1.current) {
                  setHero1Settings((prev) => ({ ...prev, speed: newSpeed }));
                } else if (selectedHero === hero2.current) {
                  setHero2Settings((prev) => ({ ...prev, speed: newSpeed }));
                }
                selectedHero.dy = newSpeed;
              }}
            />
          </label>
          <label>
            Частота стрельбы (мс):
            <input
              type="number"
              min="100"
              value={selectedHero.fireRate}
              onChange={(e) => {
                const newFireRate = parseInt(e.target.value, 10);
                if (selectedHero === hero1.current) {
                  setHero1Settings((prev) => ({
                    ...prev,
                    fireRate: newFireRate,
                  }));
                } else if (selectedHero === hero2.current) {
                  setHero2Settings((prev) => ({
                    ...prev,
                    fireRate: newFireRate,
                  }));
                }
                selectedHero.fireRate = newFireRate;
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default App;
