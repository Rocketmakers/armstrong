export type PropType<T> = T extends Array<(infer U)> ? IArrayProp<U> : IObjectProp<T>

class PropertyNameProvider<T> implements IObjectProp<T>, IArrayProp<T>, IPathResolve {
  private parts: string[] = []
  prop<K extends Extract<keyof T, string>>(key: K): PropType<T[K]> {
    this.parts.push(key)
    return this as any as PropType<T[K]>
  }

  index(index: number): IObjectProp<T> {
    this.parts.push(`${index}`)
    return this;
  }

  resolve() {
    return this.parts.join(".")
  }
}

export interface IPathResolve {
  resolve(): string
}

export interface IObjectProp<T> {
  prop<K extends Extract<keyof T, string>>(key: K): PropType<T[K]>
}

export interface IArrayProp<T> {
  index(index: number): IObjectProp<T>
}

export type PropertyPathFor<T, X> = (builder: PropType<T>) => IObjectProp<X> | IArrayProp<X>

export class PropertyPath {
  static for<T, X = any>(b: PropertyPathFor<T, X>): string {
    const a = b(new PropertyNameProvider<T>() as any)
    return (a as any as IPathResolve).resolve()
  }
}
