window.PAGE_CONFIG = {
  recipient: 'Andrea',
  message: {
    title: 'Para ti, Daniela Moreno 💜',
    text: 'Quería regalarte estas flores moradas porque te mereces todo lo hermoso que hay en este mundo, jamas deberías merecerte menos, te amo.\n\nGracias por hacer florecer mis días, gracias por todo el amor que me das, soy muy afortunada de tenerte.',
    signature: 'Con mucho cariño 💜'
  },
  interaction: {
    messages: [
      'Eres mi flor favorita 💜',
      'Contigo todo florece',
      'Haces más bonitos mis días',
      'Una rosa para alguien especial',
      'Mi jardín favorito es donde estás tú'
    ]
  },
 
};
const SVG_NS = 'http://www.w3.org/2000/svg';

function svg(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });
  return element;
}

function createRose(index) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'rose';
  button.setAttribute('aria-label', `Rosa morada ${index + 1}`);

  const drawing = svg('svg', { viewBox: '0 0 180 420', 'aria-hidden': 'true' });
  drawing.append(
    svg('path', { class: 'stem', d: 'M90 420 C92 320 86 190 90 90' }),
    svg('ellipse', { class: 'leaf', cx: '62', cy: '270', rx: '38', ry: '15' }),
    svg('ellipse', { class: 'leaf leaf--right', cx: '119', cy: '220', rx: '36', ry: '14' }),
    svg('circle', { class: 'petal', cx: '90', cy: '72', r: '48' }),
    svg('circle', { class: 'petal petal--inner', cx: '90', cy: '72', r: '27' })
  );
  button.append(drawing);
  return button;
}
const layouts = [
  { x: 16, scale: .65, delay: .8 },
  { x: 34, scale: .9, delay: .25 },
  { x: 50, scale: 1.08, delay: 0 },
  { x: 66, scale: .9, delay: .5 },
  { x: 84, scale: .65, delay: 1 }
];

function createGarden(container) {
  return layouts.map((layout, index) => {
    const rose = createRose(index);
    rose.style.setProperty('--x', `${layout.x}%`);
    rose.style.setProperty('--scale', layout.scale);
    rose.style.setProperty('--delay', `${layout.delay}s`);
    container.append(rose);
    return rose;
  });
}
function createButterfly(index) {
  const butterfly = document.createElement('span');
  butterfly.className = 'butterfly';
  butterfly.style.setProperty('--flight', `${10 + index * 2}s`);
  butterfly.style.setProperty('--top', `${18 + index * 13}%`);
  butterfly.innerHTML = '<i class="wing wing--left"></i><i class="body"></i><i class="wing wing--right"></i>';
  return butterfly;
}

for (let index = 0; index < 4; index++) {
  document.querySelector('#butterflyStage').append(createButterfly(index));
}
function typeMessage(element, message) {
  element.textContent = '';
  let index = 0;

  function frame() {
    element.textContent += message.charAt(index);
    index += 1;
    if (index < message.length) window.setTimeout(frame, 32);
  }

  frame();
}

const config = window.PAGE_CONFIG;
document.querySelector('#messageTitle').textContent = config.message.title;
document.querySelector('#messageSignature').textContent = config.message.signature;
typeMessage(document.querySelector('#messageText'), config.message.text);
function connectRoseMessages(roses, messages, output) {
  roses.forEach((rose, index) => {
    rose.addEventListener('click', () => {
      const message = messages[index % messages.length];
      output.textContent = message;
      output.classList.remove('is-visible');
      requestAnimationFrame(() => output.classList.add('is-visible'));
    });
  });
}

const garden = createGarden(document.querySelector('#roseGarden'));
connectRoseMessages(garden, config.interaction.messages, document.querySelector('#rosePhrase'));
