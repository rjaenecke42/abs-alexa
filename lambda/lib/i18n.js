'use strict';
// Spoken strings per language. The locale comes from the Alexa request, so one
// deployment serves en-* and de-* devices. Unknown locales fall back to English.

const MESSAGES = {
  en: {
    noActivePlayback: 'Please ask me to play an audiobook first.',
    welcome: 'Welcome to Audiobookshelf, you can say "play audiobook" to start listening.',
    noRecentBooks: "You haven't listened to any audiobooks recently.",
    bookByAuthor: '{title} by {author}',
    recentBooks: "You've most recently listened to: {list}.",
    playing: 'Playing {title} by {author}',
    playingTitle: 'Playing {title}',
    didNotUnderstand: 'I did not understand the request. For example, try saying "Play audiobook title by author".',
    notFound: 'Could not find a playable book matching: {title} by {author}. Please try again.',
    notFoundTitle: 'Could not find a playable book matching: {title}. Please try again.',
    lastChapter: 'This is the last chapter of {title}.',
    noChapters: 'This audiobook does not include chapter information.',
    chapterRange: 'Please choose a chapter between 1 and {count}.',
    goingToChapter: 'Going to chapter {number}.',
    unsupported: "Sorry, I can't support that yet.",
    help: 'You can say "play audio" to start playing your book! How can I help?',
    goodbye: 'Goodbye!',
    fallback: "Sorry, I don't know about that. Please try again.",
    reflector: "Sorry, I can't do that yet.",
    error: 'Sorry, I had trouble doing what you asked. Please try again.',
    listAnd: 'and'
  },
  de: {
    noActivePlayback: 'Bitte sag mir zuerst, welches Hörbuch ich abspielen soll.',
    welcome: 'Willkommen bei Audiobookshelf. Sag zum Beispiel „spiele das letzte Hörbuch“ oder „spiele“ und den Titel.',
    noRecentBooks: 'Du hast in letzter Zeit keine Hörbücher gehört.',
    bookByAuthor: '{title} von {author}',
    recentBooks: 'Zuletzt hast du gehört: {list}.',
    playing: 'Ich spiele {title} von {author}',
    playingTitle: 'Ich spiele {title}',
    didNotUnderstand: 'Das habe ich nicht verstanden. Sag zum Beispiel „spiele Titel von Autor“.',
    notFound: 'Ich habe kein passendes Hörbuch für {title} von {author} gefunden. Bitte versuch es noch einmal.',
    notFoundTitle: 'Ich habe kein passendes Hörbuch für {title} gefunden. Bitte versuch es noch einmal.',
    lastChapter: 'Das ist schon das letzte Kapitel von {title}.',
    noChapters: 'Dieses Hörbuch hat keine Kapitelinformationen.',
    chapterRange: 'Bitte wähle ein Kapitel zwischen 1 und {count}.',
    goingToChapter: 'Ich springe zu Kapitel {number}.',
    unsupported: 'Das kann ich leider noch nicht.',
    help: 'Sag „spiele das letzte Hörbuch“, „spiele“ und einen Titel, „was habe ich zuletzt gehört“, „zehn Minuten vor“ oder „gehe zu Kapitel drei“. Was möchtest du?',
    goodbye: 'Tschüss!',
    fallback: 'Das weiß ich leider nicht. Bitte versuch es noch einmal.',
    reflector: 'Das kann ich leider noch nicht.',
    error: 'Da ist leider etwas schiefgegangen. Bitte versuch es noch einmal.',
    listAnd: 'und'
  }
};

function languageOf(localeOrInput) {
  const locale = typeof localeOrInput === 'string'
    ? localeOrInput
    : localeOrInput?.requestEnvelope?.request?.locale;
  const lang = String(locale || 'en').slice(0, 2).toLowerCase();
  return MESSAGES[lang] ? lang : 'en';
}

/**
 * Translate a message key. `localeOrInput` is a locale string ("de-DE") or an
 * ASK handlerInput. Placeholders like {title} are filled from `vars`; missing
 * values are spoken as nothing rather than "undefined".
 */
function t(localeOrInput, key, vars = {}) {
  const lang = languageOf(localeOrInput);
  const template = MESSAGES[lang][key] ?? MESSAGES.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? '').toString());
}

module.exports = { t, languageOf, MESSAGES };
