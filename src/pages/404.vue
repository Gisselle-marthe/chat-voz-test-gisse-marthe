<template>
  <div class="error-page">
    <div class="stars">
      <div v-for="n in 50" :key="n" class="star" :style="getRandomPosition()"></div>
    </div>

    <div class="container">
      <div class="main-illustration">
        <svg viewBox="0 0 800 600" class="main-svg">
          <defs>
            <radialGradient id="planetGradient" cx="50%" cy="30%">
              <stop offset="0%" stop-color="#ff6b6b" />
              <stop offset="100%" stop-color="#4ecdc4" />
            </radialGradient>
            <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#667eea" />
              <stop offset="100%" stop-color="#764ba2" />
            </linearGradient>
          </defs>

          <circle cx="650" cy="150" r="120" fill="url(#planetGradient)" class="planet-main" />

          <ellipse
            cx="650"
            cy="150"
            rx="180"
            ry="30"
            fill="none"
            stroke="#ffd93d"
            stroke-width="4"
            class="planet-ring"
          />

          <g
            class="rocket"
            :style="{ transform: `translate(${rocketPosition.x}px, ${rocketPosition.y}px)` }"
          >
            <ellipse cx="0" cy="0" rx="25" ry="60" fill="url(#rocketGradient)" />

            <circle cx="0" cy="-15" r="12" fill="#a8e6cf" opacity="0.8" />
            <circle cx="0" cy="-15" r="8" fill="#88d8a3" />

            <polygon points="-25,30 -35,55 -15,45" fill="#ff6b6b" />
            <polygon points="25,30 35,55 15,45" fill="#ff6b6b" />

            <g class="rocket-flame">
              <ellipse cx="0" cy="70" rx="8" ry="20" fill="#ff9f43" class="flame flame-1" />
              <ellipse cx="0" cy="75" rx="6" ry="15" fill="#feca57" class="flame flame-2" />
              <ellipse cx="0" cy="78" rx="4" ry="10" fill="#ff6348" class="flame flame-3" />
            </g>
          </g>

          <text x="200" y="350" class="error-404" fill="#fff">404</text>

          <g
            class="alien alien-1"
            :style="{ transform: `translate(${alien1Position.x}px, ${alien1Position.y}px)` }"
          >
            <ellipse cx="0" cy="0" rx="15" ry="20" fill="#6c5ce7" />
            <circle cx="-5" cy="-5" r="3" fill="#a29bfe" />
            <circle cx="5" cy="-5" r="3" fill="#a29bfe" />
            <ellipse cx="0" cy="15" rx="8" ry="4" fill="#fd79a8" />
          </g>

          <g
            class="alien alien-2"
            :style="{ transform: `translate(${alien2Position.x}px, ${alien2Position.y}px)` }"
          >
            <ellipse cx="0" cy="0" rx="12" ry="16" fill="#00b894" />
            <circle cx="-4" cy="-3" r="2" fill="#55efc4" />
            <circle cx="4" cy="-3" r="2" fill="#55efc4" />
            <line x1="-8" y1="5" x2="-12" y2="8" stroke="#00b894" stroke-width="2" />
            <line x1="8" y1="5" x2="12" y2="8" stroke="#00b894" stroke-width="2" />
          </g>
        </svg>
      </div>

      <div class="content">
        <h1 class="glitch" data-text="¡OOPS!">¡OOPS!</h1>
        <h2 class="subtitle">Te perdiste en el espacio</h2>
        <p class="description">
          La página que buscas se fue en una misión intergaláctica. Pero no te preocupes, nuestros
          aliens están trabajando para encontrarla.
        </p>

        <div class="buttons">
          <button @click="goHome" class="btn btn-primary" @mouseenter="playHoverSound">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Volver a casa
          </button>

          <button @click="exploreSpace" class="btn btn-secondary" @mouseenter="playHoverSound">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
            Explorar el espacio
          </button>
        </div>
      </div>
    </div>

    <div v-for="n in 20" :key="`particle-${n}`" class="particle" :style="getParticleStyle(n)"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"

const rocketPosition = ref({ x: 0, y: 0 })
const alien1Position = ref({ x: 100, y: 400 })
const alien2Position = ref({ x: 500, y: 450 })

let animationFrame = null

// Funciones de animación
const animateElements = () => {
  const time = Date.now() * 0.001

  // Animación del cohete (movimiento circular suave)
  rocketPosition.value = {
    x: 150 + Math.cos(time * 0.5) * 30,
    y: 200 + Math.sin(time * 0.3) * 20,
  }

  // Animación de aliens (flotación)
  alien1Position.value = {
    x: 100 + Math.sin(time * 0.7) * 25,
    y: 400 + Math.cos(time * 0.5) * 15,
  }

  alien2Position.value = {
    x: 500 + Math.cos(time * 0.6) * 20,
    y: 450 + Math.sin(time * 0.4) * 25,
  }

  animationFrame = requestAnimationFrame(animateElements)
}

// Funciones utilitarias
const getRandomPosition = () => ({
  left: Math.random() * 100 + "%",
  top: Math.random() * 100 + "%",
  animationDelay: Math.random() * 3 + "s",
})

const getParticleStyle = index => ({
  left: Math.random() * 100 + "%",
  top: Math.random() * 100 + "%",
  animationDelay: index * 0.2 + "s",
  animationDuration: 2 + Math.random() * 3 + "s",
})

const playHoverSound = () => {
  // Aquí podrías agregar un sonido de hover si quisieras
}

// Acciones de botones
const goHome = () => {
  window.location.href = "/"
}

const exploreSpace = () => {
  // Animación especial antes de redirigir
  document.querySelector(".rocket").style.transform = "translateX(1000px) rotate(45deg)"
  setTimeout(() => {
    window.location.href = "/explore"
  }, 1000)
}

// Lifecycle hooks
onMounted(() => {
  animateElements()
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  font-family: "Arial", sans-serif;
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

.container {
  display: flex;
  align-items: center;
  gap: 50px;
  z-index: 10;
  max-width: 1200px;
  padding: 20px;
}

.main-illustration {
  flex: 1;
}

.main-svg {
  width: 100%;
  height: auto;
  max-width: 800px;
}

.planet-main {
  animation: rotate 20s linear infinite;
  transform-origin: center;
}

.planet-ring {
  animation: rotate 15s linear infinite reverse;
  transform-origin: center;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rocket {
  transform-origin: center;
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.rocket-flame {
  animation: flicker 0.1s infinite alternate;
}

@keyframes flicker {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

.flame-1 {
  animation-delay: 0s;
}
.flame-2 {
  animation-delay: 0.05s;
}
.flame-3 {
  animation-delay: 0.1s;
}

.error-404 {
  font-size: 120px;
  font-weight: bold;
  opacity: 0.4;
  pointer-events: none;
}

.alien {
  transition: transform 0.1s ease-out;
}

.content {
  flex: 1;
  color: white;
  text-align: left;
}

.glitch {
  font-size: 4rem;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  margin: 0 0 20px 0;
  animation: glitch 2s infinite;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  animation: glitch-1 0.25s infinite;
  color: #ff0040;
  z-index: -1;
}

.glitch::after {
  animation: glitch-2 0.25s infinite;
  color: #00ffff;
  z-index: -2;
}

@keyframes glitch {
  0%,
  99% {
    transform: translate(0);
  }
  1% {
    transform: translate(-2px, 2px);
  }
}

@keyframes glitch-1 {
  0%,
  99% {
    transform: translate(0);
  }
  1% {
    transform: translate(-2px, -2px);
  }
}

@keyframes glitch-2 {
  0%,
  99% {
    transform: translate(0);
  }
  1% {
    transform: translate(2px, 2px);
  }
}

.subtitle {
  font-size: 2rem;
  margin: 0 0 20px 0;
  opacity: 0.9;
}

.description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 0 0 40px 0;
  opacity: 0.8;
  max-width: 500px;
}

.buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  pointer-events: none;
  animation: float 4s infinite ease-in-out;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-100px) rotate(180deg);
    opacity: 0.3;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    text-align: center;
  }

  .glitch {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }

  .buttons {
    justify-content: center;
  }

  .main-svg {
    max-width: 400px;
  }
}
</style>
