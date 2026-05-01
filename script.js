const menuAudio = new Audio('menu.mp3');

const menuText = `
  Ласкаво просимо до нашого меню!
  Круасан — двадцять п'ять гривень. Ніжний, хрусткий, з маслом.
  Медівник — сто вісімдесят гривень. Класичний домашній торт.
  Капкейк — сорок п'ять гривень. З кремом та ягодами.
  Хліб — шістдесят гривень. Домашній, на заквасці.
  Пончик — тридцять гривень. З полуничним джемом.
  Смачного!
`;

function readMenu() {
  const wave = document.getElementById('wave-visual');
  const synth = window.speechSynthesis;

  // Якщо вже грає mp3 — зупиняємо
  if (!menuAudio.paused) {
    menuAudio.pause();
    menuAudio.currentTime = 0;
    wave.classList.remove('active');
    return;
  }

  // Якщо вже говорить TTS — зупиняємо
  if (synth.speaking) {
    synth.cancel();
    wave.classList.remove('active');
    return;
  }

  // Шукаємо український голос у системі
  const voices = synth.getVoices();
  const ukVoice = voices.find(v => v.lang === 'uk-UA') ||
                  voices.find(v => v.lang.startsWith('uk'));

  if (ukVoice) {
    // ✅ Є українській голос — використовуємо TTS
    const utterance = new SpeechSynthesisUtterance(menuText);
    utterance.voice = ukVoice;
    utterance.lang = ukVoice.lang;
    utterance.rate = 0.9;

    wave.classList.add('active');
    utterance.onend   = () => wave.classList.remove('active');
    utterance.onerror = () => wave.classList.remove('active');

    synth.speak(utterance);

  } else {
    // ❌ Немає українського — запускаємо mp3
    wave.classList.add('active');
    menuAudio.play();
    menuAudio.onended = () => wave.classList.remove('active');
  }
}

// Голоси завантажуються асинхронно — чекаємо
speechSynthesis.addEventListener('voiceschanged', () => {});