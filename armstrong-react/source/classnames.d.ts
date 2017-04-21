declare module "classnames" {
  namespace classNames{}
  type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | false;

  interface ClassDictionary {
    [id: string]: boolean | undefined | null;
  }

  interface ClassArray extends Array<ClassValue> { }

  function classNames(...classes: ClassValue[]): string;
  export = classNames;
}
