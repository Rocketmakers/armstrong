import * as classNamesInternal from "classnames";

export interface ClassDictionary {
	[id: string]: boolean;
}

export type ClassNamesType = ClassDictionary | string;

var cn: (...classes: ClassNamesType[])=> string = <any>classNamesInternal;

/**
Concatinates all classnames and truthy ClassDictionary passed as the parameters
*/
export function classNames(...classes: ClassNamesType[]): string{
  return cn(...classes.filter(c => c != undefined));
}

/**
Returns a classname dictionary for use in the classNames function
*/
export function cd(className: string, value: boolean) : ClassDictionary {
  var d: ClassDictionary = {};
  d[className] = value;
  return d;
}

