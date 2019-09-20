import { calendarUtils } from "../utilities/calendarUtils";

export const setLocale = (locale: string) => {
  calendarUtils.locale.setLocale(locale)
}

export const isLocaleSet = () => calendarUtils.locale.isLocaleSet();
