export type RadioPresenter = 'female' | 'male'

export const RADIO_VOICES = {
  female: {
    label: 'Female presenter',
    voice: process.env.DV_RADIO_FEMALE_VOICE || 'marin',
    instructions:
      'Read as a natural, experienced Australian or New Zealand radio news presenter. Calm, warm, credible and conversational. Use normal newsroom pacing, short natural pauses, understated emphasis and clear pronunciation. Never sound theatrical, synthetic, sales-like, overly cheerful or like a computer voice.',
  },
  male: {
    label: 'Male presenter',
    voice: process.env.DV_RADIO_MALE_VOICE || 'cedar',
    instructions:
      'Read as a natural, experienced Australian or New Zealand radio news presenter. Calm, warm, credible and conversational. Use normal newsroom pacing, short natural pauses, understated emphasis and clear pronunciation. Never sound theatrical, synthetic, sales-like, overly cheerful or like a computer voice.',
  },
} as const

export function getRadioVoice(presenter: RadioPresenter) {
  return RADIO_VOICES[presenter]
}
