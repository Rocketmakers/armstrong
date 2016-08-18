import * as moment from "moment";

let localeSet = false;

export const setLocale = (locale: string) => {
  if (localeSet) {
    const previousLocal = moment.locale();
    console.warn(`Armstrong locale has already been set to ${previousLocal}, you probably only want to set it once!`);
  }

  moment.locale(locale);
  localeSet = true;
}
