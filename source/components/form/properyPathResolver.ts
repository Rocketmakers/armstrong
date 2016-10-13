import * as _ from "underscore";

export class PropertyPathResolver {
  static getValue(data: any, dataName: string): any{
    const parts = dataName.split(".");
    return _.reduce(parts, (result,p: string, index: number)=>{
      if (!result || !p){
        throw new Error(`${dataName} not found in data - failed on '${p}' (part: ${index})`);
      }
      return result[p]
    }, data);
  }

  static setValue(data: any, dataName: string, value: any): void{
    const parts = dataName.split(".");
    const lastIndex = parts.length - 1;
    _.each(parts, (p,index) => {
      if (!data || !p){
        throw new Error(`${dataName} not found in data - failed on '${p}' (part: ${index})`);
      }
      if (index === lastIndex) {
        data[p] = value;
        return
      }
      data = data[p];
    })
  }
}
