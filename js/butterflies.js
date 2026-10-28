(function () {
  'use strict';

  const app = (window.GardenApp = window.GardenApp || {});
  const baseButterflies = [
    { path: 'orbit', scale: 1, speed: 0.44, hue: 0, flight: 18, delay: 1.3 },
    { path: 'eight', scale: 0.78, speed: 0.51, hue: -8, flight: 21, delay: 1.9 },
    { path: 'visit', scale: 0.62, speed: 0.39, hue: 7, flight: 24, delay: 2.5 },
    { path: 'eight', scale: 0.56, speed: 0.46, hue: 10, flight: 25, delay: 3.1 },
    { path: 'orbit', scale: 0.7, speed: 0.55, hue: -5, flight: 23, delay: 3.7 },
    { path: 'visit', scale: 0.48, speed: 0.36, hue: 5, flight: 27, delay: 4.3 },
    { path: 'orbit', scale: 0.42, speed: 0.49, hue: -10, flight: 29, delay: 5.1 },
  ];
  const paths = ['orbit', 'eight', 'visit'];
  const additionalButterflies = Array.from({ length: 15 }, (_, index) => ({
    path: paths[index % paths.length],
    scale: 0.34 + (index % 6) * 0.075,
    speed: 0.35 + (index % 5) * 0.045,
    hue: -12 + (index % 7) * 4,
    flight: 19 + (index % 8) * 1.7,
    delay: 1.6 + (index % 7) * 0.58,
  }));
  const butterflies = [...baseButterflies, ...additionalButterflies];

  app.createButterflies = function createButterflies(container) {
    const fragment = document.createDocumentFragment();
    butterflies.forEach((data) => {
      const path = document.createElement('div');
      path.className = `butterfly-path butterfly-path--${data.path}`;

      const turn = document.createElement('div');
      turn.className = 'butterfly-turn';

      const butterfly = document.createElement('div');
      butterfly.className = 'butterfly';
      butterfly.style.setProperty('--butterfly-scale', data.scale);
      butterfly.style.setProperty('--flutter-speed', `${data.speed}s`);
      path.style.setProperty('--flight-duration', `${data.flight}s`);
      path.style.setProperty('--flight-delay', `${data.delay}s`);
      butterfly.style.filter = `hue-rotate(${data.hue}deg)`;

      const leftWing = document.createElement('span');
      leftWing.className = 'butterfly__wing butterfly__wing--left';
      const rightWing = document.createElement('span');
      rightWing.className = 'butterfly__wing butterfly__wing--right';
      const body = document.createElement('span');
      body.className = 'butterfly__body';

      butterfly.append(leftWing, rightWing, body);
      turn.append(butterfly);
      path.append(turn);
      fragment.append(path);
    });
    container.replaceChildren(fragment);
  };
})();
