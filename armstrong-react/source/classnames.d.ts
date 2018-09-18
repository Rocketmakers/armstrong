declare module "classnames" {
  namespace classNames { }
  type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | false;

  // tslint:disable-next-line:interface-name
  interface ClassDictionary {
    [id: string]: boolean | undefined | null;
  }

  // tslint:disable-next-line:interface-name
  interface ClassArray extends Array<ClassValue> { }

  function classNames(...classes: ClassValue[]): string;
  export = classNames;
}
