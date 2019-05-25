import { dateUtils } from "../utilities/dateUtils";

export const setLocale = (locale: string) => {
  dateUtils.locale.setLocale(locale)
}

export const isLocaleSet = () => dateUtils.locale.isLocaleSet();
