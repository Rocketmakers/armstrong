export interface IFormBinding{
  prop: string;
  data?: any;
  context?: any;
}

export class Binder {
   /** Loop through the property path and update the relevant field on the entity */
   public static handleChange(propName: string, value: any, type: string, entity: any) {
    if (propName.indexOf('.') !== -1) {
      let ps = propName.split('.');
      let p;
      ps.forEach((pName, i) => {
        if (i == 0) {
          p = entity[pName];
        } else if (i == ps.length - 1) {
          p[pName] = this.parseValue(type, value);
        } else {
          p = p[pName];
        }
      })
    }
    else {
      entity[propName] = this.parseValue(type, value);
    }
  }

  /** Handle data that we don't want to return as a string (for numbers only currently) */
  private static parseValue(type: string, value: any){
    switch (type) {
      case "number":
        return parseFloat(value);
      default:
        return value;
    }
  }
}