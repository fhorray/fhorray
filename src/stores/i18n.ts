import { createI18n, formatter } from '@nanostores/i18n'
import { persistentAtom } from '@nanostores/persistent'

export const locale = persistentAtom<string>('locale', 'pt')

export const format = formatter(locale)

const translations = import.meta.glob<{ default: Record<string, unknown> }>('../../public/translations/*.json')


export const i18n = createI18n(locale, {
  baseLocale: 'pt',
  async get(code) {
    console.log(`[i18n] Loading: ${code}`)
    const path = `../../public/translations/${code}.json`
    const loader = translations[path]
    if (loader) {
      const mod = await loader()
      return mod.default as Record<string, Record<string, string | Record<string, string>>>
    }


    console.warn(`[i18n] Not found: ${code}`)
    return {}
  }
})



