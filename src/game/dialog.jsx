export const DIALOG = {
  greeting: {
    npc: "Welcome, traveller. I am Lyra, keeper of the celestial arts. The stars hold many secrets for those who seek them.",
    choices: [
      { text: "Read my fortune.",   action: 'horoscope' },
      { text: "Who are you?",       next:   'about'     },
      { text: "Farewell.",          action: 'close'     },
    ],
  },
  about: {
    npc: "I have tended this table and studied the heavens for thirty years. Every soul that passes carries a story written in the stars.",
    choices: [
      { text: "Read my fortune.",   action: 'horoscope' },
      { text: "Farewell.",          action: 'close'     },
    ],
  },
}
