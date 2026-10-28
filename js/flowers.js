(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const app = (window.GardenApp = window.GardenApp || {});

  const roseLayouts = [
    { x: 20, width: 126, height: 365, scale: 0.72, depth: 2, z: -95, delay: 1.6, sway: 7.2, lean: -12 },
    { x: 27, width: 120, height: 335, scale: 0.55, depth: 1, z: -130, delay: 1.3, sway: 7.9, lean: -17 },
    { x: 30, width: 158, height: 430, scale: 1.05, depth: 5, z: 0, delay: 0.35, sway: 7.4, lean: -8 },
    { x: 37, width: 142, height: 405, scale: 0.85, depth: 3, z: -50, delay: 0.7, sway: 6.7, lean: -9 },
    { x: 43, width: 122, height: 345, scale: 0.6, depth: 1, z: -125, delay: 1.1, sway: 8.4, lean: -5 },
    { x: 50, width: 178, height: 465, scale: 1.25, depth: 7, z: 35, delay: 0, sway: 8.1, lean: 0 },
    { x: 57, width: 122, height: 345, scale: 0.65, depth: 1, z: -120, delay: 1.5, sway: 8, lean: 5 },
    { x: 63, width: 140, height: 398, scale: 0.88, depth: 3, z: -55, delay: 1.0, sway: 6.4, lean: 9 },
    { x: 70, width: 158, height: 426, scale: 1.0, depth: 5, z: 0, delay: 0.5, sway: 7.1, lean: 8 },
    { x: 73, width: 116, height: 338, scale: 0.52, depth: 1, z: -135, delay: 1.25, sway: 8.2, lean: 12 },
    { x: 80, width: 126, height: 368, scale: 0.78, depth: 2, z: -90, delay: 1.8, sway: 7.5, lean: 14 },
    { x: 40, width: 118, height: 342, scale: 0.5, depth: 1, z: -140, delay: 1.4, sway: 7.8, lean: -6 },
    { x: 60, width: 118, height: 342, scale: 0.5, depth: 1, z: -140, delay: 1.9, sway: 8.3, lean: 6 },
  ];

  const budLayouts = [
    { x: 5, width: 82, height: 286, scale: 0.58, depth: 1, z: -145, delay: 1.75, sway: 8.1, lean: -20 },
    { x: 13, width: 90, height: 315, scale: 0.68, depth: 2, z: -85, delay: 1.25, sway: 7.7, lean: -18 },
    { x: 87, width: 86, height: 300, scale: 0.64, depth: 2, z: -90, delay: 1.45, sway: 7.2, lean: 17 },
    { x: 95, width: 80, height: 280, scale: 0.56, depth: 1, z: -150, delay: 1.95, sway: 8.3, lean: 21 },
  ];

  function svgElement(name, attributes = {}) {
    const element = document.createElementNS(NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  }

  function stop(offset, color, opacity) {
    return svgElement('stop', { offset, 'stop-color': color, 'stop-opacity': opacity });
  }

  function buildDefs(index) {
    const defs = svgElement('defs');
    const petal = svgElement('radialGradient', {
      id: `petal-gradient-${index}`,
      cx: '46%',
      cy: '24%',
      r: '82%',
    });
    petal.append(
      stop('0%', '#e6b9fa', 1),
      stop('34%', '#b36add', 1),
      stop('72%', '#74319f', 1),
      stop('100%', '#42145f', 1),
    );

    const inner = svgElement('radialGradient', {
      id: `inner-gradient-${index}`,
      cx: '52%',
      cy: '28%',
      r: '75%',
    });
    inner.append(
      stop('0%', '#f0d0ff', 1),
      stop('38%', '#a758cf', 1),
      stop('100%', '#41105c', 1),
    );

    const stem = svgElement('linearGradient', {
      id: `stem-gradient-${index}`,
      x1: '0',
      y1: '0',
      x2: '1',
      y2: '0',
    });
    stem.append(stop('0%', '#10271d', 1), stop('52%', '#47765a', 1), stop('100%', '#173426', 1));

    const leaf = svgElement('linearGradient', {
      id: `leaf-gradient-${index}`,
      x1: '0',
      y1: '0',
      x2: '1',
      y2: '1',
    });
    leaf.append(stop('0%', '#4c8061', 1), stop('55%', '#28513d', 1), stop('100%', '#112a1f', 1));
    defs.append(petal, inner, stem, leaf);
    return defs;
  }

  function createLeaf(index, side, y, scale, leafDelay) {
    const position = svgElement('g', {
      transform: `translate(${side === 'left' ? 88 : 92} ${y}) scale(${side === 'left' ? -scale : scale} ${scale})`,
    });
    const group = svgElement('g', {
      class: 'rose-leaf',
      style: `--leaf-rotation:${side === 'left' ? '-35deg' : '35deg'};--leaf-origin:${side === 'left' ? '100% 50%' : '0% 50%'};--leaf-delay:${leafDelay}s`,
    });
    const blade = svgElement('path', {
      d: 'M0 0 C17 -24 48 -30 68 -15 C50 5 25 14 0 0 Z',
      fill: `url(#leaf-gradient-${index})`,
      stroke: 'rgba(112,156,127,.35)',
      'stroke-width': '1.2',
    });
    const vein = svgElement('path', {
      d: 'M4 -1 C25 -7 43 -11 61 -14 M26 -7 L38 -19 M38 -10 L51 -20 M22 -6 L37 3 M39 -10 L53 -3',
      fill: 'none',
      stroke: 'rgba(166,197,174,.23)',
      'stroke-width': '1',
      'stroke-linecap': 'round',
    });
    group.append(blade, vein);
    position.append(group);
    return position;
  }

  function petal(index, d, transform, delay, fold, fill = 'petal') {
    const position = svgElement('g', { transform });
    position.append(svgElement('path', {
      class: 'rose-petal',
      d,
      fill: `url(#${fill}-gradient-${index})`,
      stroke: 'rgba(238,211,255,.24)',
      'stroke-width': '1',
      style: `--petal-delay:${delay}s;--petal-fold:${fold}deg`,
    }));
    return position;
  }

  function createRoseHead(index) {
    const position = svgElement('g', { transform: 'translate(90 88)' });
    const head = svgElement('g', { class: 'rose-head' });
    head.append(
      svgElement('ellipse', { class: 'rose-glow', cx: '0', cy: '0', rx: '77', ry: '67' }),
      petal(index, 'M0 30 C-37 49 -72 31 -72 5 C-72 -22 -44 -35 -9 -15 C-22 2 -19 18 0 30 Z', 'rotate(-12)', 1.22, -32),
      petal(index, 'M0 31 C35 50 72 31 72 5 C72 -22 44 -35 9 -15 C22 2 19 18 0 31 Z', 'rotate(12)', 1.28, 32),
      petal(index, 'M-4 29 C-40 29 -61 5 -52 -24 C-44 -50 -14 -54 8 -25 C-7 -13 -12 8 -4 29 Z', 'rotate(-8)', 1.34, -26),
      petal(index, 'M4 29 C40 29 61 5 52 -24 C44 -50 14 -54 -8 -25 C7 -13 12 8 4 29 Z', 'rotate(8)', 1.4, 26),
      petal(index, 'M-24 19 C-46 -7 -38 -43 -12 -57 C8 -68 25 -51 21 -27 C5 -28 -14 -11 -24 19 Z', 'rotate(-5)', 1.46, -20),
      petal(index, 'M24 19 C46 -7 38 -43 12 -57 C-8 -68 -25 -51 -21 -27 C-5 -28 14 -11 24 19 Z', 'rotate(5)', 1.52, 20),
      petal(index, 'M0 21 C-25 6 -30 -26 -15 -47 C-4 -63 14 -61 26 -43 C12 -30 4 -9 0 21 Z', 'rotate(-8)', 1.58, -16),
      petal(index, 'M0 21 C25 6 30 -26 15 -47 C4 -63 -14 -61 -26 -43 C-12 -30 -4 -9 0 21 Z', 'rotate(8)', 1.64, 16),
      petal(index, 'M-2 14 C-20 -3 -15 -33 1 -45 C15 -56 29 -39 25 -21 C14 -22 1 -7 -2 14 Z', 'rotate(-15)', 1.7, -12, 'inner'),
      petal(index, 'M2 14 C20 -3 15 -33 -1 -45 C-15 -56 -29 -39 -25 -21 C-14 -22 -1 -7 2 14 Z', 'rotate(15)', 1.76, 12, 'inner'),
      petal(index, 'M0 9 C-15 -2 -13 -25 0 -34 C13 -25 15 -2 0 9 Z', 'rotate(-4)', 1.82, -8, 'inner'),
    );

    const highlight = svgElement('path', {
      class: 'rose-highlight',
      d: 'M-46 -17 C-36 -40 -19 -48 -4 -45 M20 -40 C31 -30 34 -16 31 -4',
      fill: 'none',
      stroke: 'rgba(250,232,255,.34)',
      'stroke-width': '2.1',
      'stroke-linecap': 'round',
    });
    const spiral = svgElement('path', {
      class: 'rose-spiral',
      d: 'M-5 -17 C8 -29 21 -18 14 -7 C7 4 -9 0 -10 -10 C-11 -17 -3 -22 3 -19',
    });
    head.append(highlight, spiral);
    position.append(head);
    return position;
  }

  function createRose(layout, index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'rose-plant';
    button.dataset.roseIndex = String(index);
    button.setAttribute('aria-label', `Rosa morada ${index + 1}. Tócala para descubrir un mensaje.`);
    button.style.cssText = [
      `--x:${layout.x}%`,
      `--width:${layout.width}px`,
      `--height:${layout.height}px`,
      `--scale:${layout.scale}`,
      `--depth:${layout.depth}`,
      `--z:${layout.z}px`,
      `--delay:${layout.delay}s`,
      `--sway-duration:${layout.sway}s`,
    ].join(';');

    const sway = document.createElement('span');
    sway.className = 'rose-plant__sway';
    const svg = svgElement('svg', {
      class: 'rose-svg',
      viewBox: '0 0 180 420',
      role: 'img',
      'aria-hidden': 'true',
      preserveAspectRatio: 'xMidYMax meet',
    });
    svg.append(buildDefs(index));

    const stem = svgElement('path', {
      class: 'rose-stem',
      d: `M90 418 C${92 + layout.lean * 0.2} 330 ${91 + layout.lean * 0.65} 210 ${90 + layout.lean} 96`,
      pathLength: '1',
      style: `stroke:url(#stem-gradient-${index})`,
    });
    svg.append(
      stem,
      createLeaf(index, 'left', 305, 0.78, 0.55),
      createLeaf(index, 'right', 255, 0.72, 0.8),
      createLeaf(index, 'left', 207, 0.62, 1.05),
      createRoseHead(index),
    );
    sway.append(svg);
    button.append(sway);
    return button;
  }

  function createBud(layout, index) {
    const plant = document.createElement('div');
    plant.className = 'rose-plant rose-plant--bud';
    plant.setAttribute('aria-hidden', 'true');
    plant.style.cssText = [
      `--x:${layout.x}%`,
      `--width:${layout.width}px`,
      `--height:${layout.height}px`,
      `--scale:${layout.scale}`,
      `--depth:${layout.depth}`,
      `--z:${layout.z}px`,
      `--delay:${layout.delay}s`,
      `--sway-duration:${layout.sway}s`,
    ].join(';');
    const sway = document.createElement('div');
    sway.className = 'rose-plant__sway';
    const svg = svgElement('svg', { class: 'rose-svg', viewBox: '0 0 180 420', preserveAspectRatio: 'xMidYMax meet' });
    const id = index + 10;
    svg.append(buildDefs(id));
    svg.append(
      svgElement('path', {
        class: 'rose-stem',
        d: `M90 418 C${90 + layout.lean * 0.3} 320 ${90 + layout.lean * 0.8} 205 ${90 + layout.lean} 105`,
        pathLength: '1',
        style: `stroke:url(#stem-gradient-${id})`,
      }),
      createLeaf(id, index === 0 ? 'right' : 'left', 282, 0.65, 0.7),
    );
    const budPosition = svgElement('g', { transform: `translate(${90 + layout.lean} 95)` });
    const bud = svgElement('g', { class: 'bud-head' });
    bud.append(
      svgElement('path', { d: 'M-29 4 C-28 -32 -12 -54 0 -57 C13 -53 29 -31 29 4 C17 21 -17 21 -29 4 Z', fill: `url(#petal-gradient-${id})`, stroke: 'rgba(239,216,255,.28)' }),
      svgElement('path', { d: 'M-27 7 C-20 24 20 24 27 7 C18 12 9 13 0 8 C-9 13 -18 12 -27 7 Z', fill: `url(#leaf-gradient-${id})` }),
      svgElement('path', { d: 'M-14 -30 C-6 -42 4 -47 12 -42', fill: 'none', stroke: 'rgba(248,226,255,.37)', 'stroke-width': '2', 'stroke-linecap': 'round' }),
    );
    budPosition.append(bud);
    svg.append(budPosition);
    sway.append(svg);
    plant.append(sway);
    return plant;
  }

  app.createGarden = function createGarden(container) {
    const fragment = document.createDocumentFragment();
    roseLayouts.forEach((layout, index) => fragment.append(createRose(layout, index)));
    budLayouts.forEach((layout, index) => fragment.append(createBud(layout, index)));
    container.replaceChildren(fragment);
    return Array.from(container.querySelectorAll('button.rose-plant'));
  };
})();
