(function () {
  'use strict';

  const app = (window.GardenApp = window.GardenApp || {});
  let seed = 9137;

  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  app.createAmbientEffects = function createAmbientEffects(starsContainer, firefliesContainer) {
    const stars = document.createDocumentFragment();
    const starCount = window.innerWidth < 600 ? 28 : 42;

    for (let index = 0; index < starCount; index += 1) {
      const star = document.createElement('span');
      star.className = 'star';
      star.style.left = `${4 + random() * 92}%`;
      star.style.top = `${3 + random() * 67}%`;
      star.style.setProperty('--size', `${0.8 + random() * 1.7}px`);
      star.style.setProperty('--alpha', (0.28 + random() * 0.55).toFixed(2));
      star.style.setProperty('--duration', `${2.5 + random() * 4}s`);
      star.style.setProperty('--delay', `${random() * -6}s`);
      stars.append(star);
    }
    starsContainer.replaceChildren(stars);

    const fireflies = document.createDocumentFragment();
    const fireflyCount = window.innerWidth < 600 ? 7 : 10;
    for (let index = 0; index < fireflyCount; index += 1) {
      const firefly = document.createElement('span');
      firefly.className = 'firefly';
      firefly.style.left = `${7 + random() * 86}%`;
      firefly.style.top = `${42 + random() * 43}%`;
      firefly.style.setProperty('--duration', `${7 + random() * 6}s`);
      firefly.style.setProperty('--delay', `${random() * -12}s`);
      firefly.style.setProperty('--drift-x', `${-30 + random() * 60}px`);
      fireflies.append(firefly);
    }
    firefliesContainer.replaceChildren(fireflies);
  };

  app.setupRoseInteractions = function setupRoseInteractions(roses, sparkleLayer, phraseElement, messages) {
    const sparklePool = Array.from({ length: 12 }, () => {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle';
      sparkleLayer.append(sparkle);
      return sparkle;
    });

    let sparkleIndex = 0;
    let messageIndex = 0;
    let lastInteraction = 0;
    let phraseTimer = 0;

    function releaseSparkle(sparkle) {
      sparkle.classList.remove('is-active');
    }

    function burstAt(x, y) {
      for (let index = 0; index < 6; index += 1) {
        const sparkle = sparklePool[sparkleIndex % sparklePool.length];
        sparkleIndex += 1;
        releaseSparkle(sparkle);
        const angle = (Math.PI * 2 * index) / 6 + random() * 0.45;
        const distance = 22 + random() * 28;
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
        sparkle.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
        void sparkle.offsetWidth;
        sparkle.classList.add('is-active');
        sparkle.addEventListener('animationend', () => releaseSparkle(sparkle), { once: true });
      }
    }

    function showPhrase(message) {
      phraseElement.textContent = message;
      phraseElement.classList.add('is-visible');
      window.clearTimeout(phraseTimer);
      phraseTimer = window.setTimeout(() => phraseElement.classList.remove('is-visible'), 2400);
    }

    roses.forEach((rose) => {
      rose.addEventListener('click', () => {
        const now = performance.now();
        if (now - lastInteraction < 650) return;
        lastInteraction = now;

        const bounds = rose.getBoundingClientRect();
        const x = bounds.left + bounds.width / 2;
        const y = bounds.top + bounds.height * 0.2;
        rose.classList.remove('is-loved');
        void rose.offsetWidth;
        rose.classList.add('is-loved');
        rose.addEventListener('animationend', () => rose.classList.remove('is-loved'), { once: true });
        burstAt(x, y);

        if (messages.length) {
          showPhrase(messages[messageIndex % messages.length]);
          messageIndex += 1;
        }
      });
    });

    return function cleanup() {
      window.clearTimeout(phraseTimer);
    };
  };
})();
