(function () {
  'use strict';

  const defaults = {
    recipient: 'Daniela ',
    intro: {
      title: 'Tengo unas rosas moradas para ti 💜',
      subtitle: 'Un pequeño jardín para alguien muy especial',
      buttonText: 'Descubrir mi jardín',
    },
    message: {
      title: 'Para ti, Daniela  💜',
      text:
        'Quería regalarte estas rosas moradas para recordarte lo especial que eres.\n\n' +
        'Hay personas que llegan a nuestra vida y hacen florecer hasta los días más grises.\n\n' +
        'Gracias por ser una de esas personas.',
      signature: 'Con mucho cariño A 💜',
    },
    interaction: {
      messages: [
        'Eres mi flor favorita 💜',
        'Contigo todo florece',
        'Una rosa para alguien especial',
        'Haces más bonitos mis días',
        'Mi jardín favorito es donde estás tú',
      ],
    },
    music: {
      enabled: false,
      src: 'assets/cancion.mp3',
      volume: 0.5,
    },
    branding: {
      enabled: false,
      text: 'Creado con ♡ por unDetalleDev',
    },
  };

  const supplied = window.PAGE_CONFIG && typeof window.PAGE_CONFIG === 'object' ? window.PAGE_CONFIG : {};
  const objectOrEmpty = (value) => (value && typeof value === 'object' ? value : {});
  const textOr = (value, fallback) => (typeof value === 'string' ? value : fallback);
  const suppliedRecipient = textOr(supplied.recipient, defaults.recipient).trim() || defaults.recipient;
  const suppliedMessage = objectOrEmpty(supplied.message);
  const configuredMessages = objectOrEmpty(supplied.interaction).messages;

  window.PAGE_CONFIG = {
    recipient: suppliedRecipient,
    intro: {
      ...defaults.intro,
      ...objectOrEmpty(supplied.intro),
    },
    message: {
      ...defaults.message,
      ...suppliedMessage,
      title:
        typeof suppliedMessage.title === 'string'
          ? suppliedMessage.title
          : `Para ti, ${suppliedRecipient} 💜`,
    },
    interaction: {
      messages:
        Array.isArray(configuredMessages) && configuredMessages.some((item) => typeof item === 'string')
          ? configuredMessages.filter((item) => typeof item === 'string' && item.trim())
          : defaults.interaction.messages,
    },
    music: {
      ...defaults.music,
      ...objectOrEmpty(supplied.music),
    },
    branding: {
      ...defaults.branding,
      ...objectOrEmpty(supplied.branding),
    },
  };

  const volume = Number(window.PAGE_CONFIG.music.volume);
  window.PAGE_CONFIG.music.volume = Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : 0.5;
})();
