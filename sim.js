/* =========================================================
   MOTION SIMULATION — sim.js
   Grade 7 Physics | Offline | Classroom Safe
   Author: Senior Front-End + Physics Curriculum Designer
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ===========================
     SAFETY CHECKS
  =========================== */
  const canvas = document.getElementById("simCanvas");
  if (!canvas) {
    console.error("❌ Canvas #simCanvas not found.");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("❌ 2D context not supported.");
    return;
  }

  /* ===========================
     CONSTANTS & SETTINGS
  =========================== */
  const g = 9.81; // gravity (m/s²)
  const radius = 20;

  let animationId = null;
  let lastTime = null;
  let running = false;

  /* ===========================
     CLASS: MovingObject
  =========================== */
  class MovingObject {
    constructor(name, color, mass, speed) {
      this.name = name;
      this.color = color;
      this.mass = mass;
      this.speed = speed;
      this.position = 0;
      this.acceleration = 0;
    }

    applyForces(frictionMu, airC) {
      const friction = frictionMu * this.mass * g;
      const airRes = airC * this.speed;
      const drivingForce = this.mass * this.speed;

      const netForce = Math.max(0, drivingForce - friction - airRes);
      this.acceleration = netForce / this.mass;
    }

    update(dt, maxDistance) {
      this.speed += this.acceleration * dt;
      this.speed = Math.max(0, this.speed);

      this.position += this.speed * dt;

      if (this.position >= maxDistance) {
        this.position = maxDistance;
        this.speed = 0;
        this.acceleration = 0;
      }
    }
  }

  /* ===========================
     OBJECT SETUP
  =========================== */
  const objectData = [
    { name: "A", color: "red", speed: 0, mass: 10 },
    { name: "B", color: "green", speed: 0, mass: 10 },
    { name: "C", color: "blue", speed: 0, mass: 10 }
  ];

  const objects = {};
  objectData.forEach(o => {
    objects[o.name] = new MovingObject(o.name, o.color, o.mass, o.speed);
  });

  /* ===========================
     DOM REFERENCES
  =========================== */
  const controlsContainer = document.getElementById("objectControls");
  const template = document.getElementById("object-control-template");

  const sliders = {
    maxDistance: document.getElementById("maxDistance"),
    timeScale: document.getElementById("timeScale"),
    friction: document.getElementById("friction"),
    airRes: document.getElementById("airRes")
  };

  const displays = {
    maxDistVal: document.getElementById("maxDistVal"),
    timeScaleVal: document.getElementById("timeScaleVal"),
    frictionVal: document.getElementById("frictionVal"),
    airResVal: document.getElementById("airResVal")
  };

  /* ===========================
     CREATE OBJECT CONTROLS
  =========================== */
  objectData.forEach(o => {
    const clone = template.content.cloneNode(true);
    const wrapper = clone.querySelector("div");

    wrapper.querySelector("h2").textContent =
      `Object ${o.name} (${o.color.toUpperCase()})`;

    controlsContainer.appendChild(clone);
  });

  const controlDivs = controlsContainer.querySelectorAll(":scope > div");

  /* ===========================
     UPDATE FROM SLIDERS
  =========================== */
  function updateObjects() {
    controlDivs.forEach((div, i) => {
      const obj = objects[objectData[i].name];

      const speedSlider = div.querySelector(".speedSlider");
      const massSlider = div.querySelector(".massSlider");
      const speedVal = div.querySelector(".speedVal");
      const massVal = div.querySelector(".massVal");

      obj.speed = parseFloat(speedSlider.value);
      obj.mass = parseFloat(massSlider.value);

      speedVal.textContent = obj.speed.toFixed(1);
      massVal.textContent = obj.mass.toFixed(1);
    });

    displays.maxDistVal.textContent = sliders.maxDistance.value;
    displays.timeScaleVal.textContent = sliders.timeScale.value;
    displays.frictionVal.textContent = sliders.friction.value;
    displays.airResVal.textContent = sliders.airRes.value;
  }

  /* ===========================
     DRAW FUNCTION
  =========================== */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const spacing = canvas.height / 4;
    let row = 1;

    ["A", "B", "C"].forEach(key => {
      const obj = objects[key];

      const x =
        50 +
        (obj.position / parseFloat(sliders.maxDistance.value)) *
          (canvas.width - 100);

      const y = row * spacing;

      ctx.fillStyle = obj.color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "14px Inter, sans-serif";
      ctx.fillText(`Speed: ${obj.speed.toFixed(1)} m/s`, x - 35, y - 30);
      ctx.fillText(`Distance: ${obj.position.toFixed(1)} m`, x - 35, y - 15);

      row++;
    });
  }

  /* ===========================
     ANIMATION LOOP
  =========================== */
  function animate(time) {
    if (!lastTime) lastTime = time;

    const dt =
      ((time - lastTime) / 1000) * parseFloat(sliders.timeScale.value);
    lastTime = time;

    ["A", "B", "C"].forEach(key => {
      const obj = objects[key];
      obj.applyForces(
        parseFloat(sliders.friction.value),
        parseFloat(sliders.airRes.value)
      );
      obj.update(dt, parseFloat(sliders.maxDistance.value));
    });

    draw();

    if (running) {
      animationId = requestAnimationFrame(animate);
    }
  }

  /* ===========================
     EVENT LISTENERS
  =========================== */
  controlDivs.forEach(div => {
    div.querySelectorAll("input").forEach(slider =>
      slider.addEventListener("input", updateObjects)
    );
  });

  Object.values(sliders).forEach(slider =>
    slider.addEventListener("input", updateObjects)
  );

  document.getElementById("startBtn").addEventListener("click", () => {
    if (!running) {
      running = true;
      lastTime = null;
      animationId = requestAnimationFrame(animate);
    }
  });

  document.getElementById("pauseBtn").addEventListener("click", () => {
    running = false;
    if (animationId) cancelAnimationFrame(animationId);
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    running = false;
    if (animationId) cancelAnimationFrame(animationId);

    ["A", "B", "C"].forEach((key, i) => {
      const obj = objects[key];
      obj.position = 0;
      obj.speed = parseFloat(
        controlDivs[i].querySelector(".speedSlider").value
      );
      obj.acceleration = 0;
    });

    draw();
  });

  /* ===========================
     KEYBOARD SHORTCUTS
  =========================== */
  document.addEventListener("keydown", e => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      document.getElementById("startBtn").click();
    }
    if (e.key.toLowerCase() === "p") {
      document.getElementById("pauseBtn").click();
    }
    if (e.key.toLowerCase() === "r") {
      document.getElementById("resetBtn").click();
    }
  });

  /* ===========================
     INITIALIZE
  =========================== */
  updateObjects();
  draw();
});
