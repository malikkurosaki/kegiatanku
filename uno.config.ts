import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  content: {
    filesystem: [
      'src/**/*.{html,js,jsx,ts,tsx}',
      'public/**/*.html',
    ],
  },
})
