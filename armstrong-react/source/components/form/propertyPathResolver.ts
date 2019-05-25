import { utils } from "../../utilities/utils";

/**
 * Get and Set values in JSON data objects
 * Uses dot notation to access members of the object graph
 * e.g.
 * const name = PropertyPathResolver.getValue(person, "name")
 * const firstAddressTitle = PropertyPathResolver.getValue(person, "addresses.0.title")
 */
export class PropertyPathResolver {

  /**
   * Get values in JSON data objects using dot notation to access members of the object graph
   * e.g.
   * const name = PropertyPathResolver.getValue(person, "name")
   * const firstAddressTitle = PropertyPathResolver.getValue(person, "addresses.0.title")
   */
  static getValue(data: any, dataPath: string): any {
    const parts = dataPath.split(".");
    return utils.array.reduce(parts, (result, p: string, index: number) => {
      if (!result || !p) {
        throw new Error(`armstrong-react: Your form binding ${dataPath} is incorrect! getValue failed on '${p}' (part: ${index})`);
      }
      return result[p]
    }, data);
  }

  /**
   * Set values in JSON data objects using dot notation to access members of the object graph
   * e.g.
   * PropertyPathResolver.setValue(person, "name", "Dave")
   * PropertyPathResolver.setValue(person, "addresses.0.title", "home")
   */
  static setValue(data: any, dataPath: string, value: any): void {
    const parts = dataPath.split(".");
    const lastIndex = parts.length - 1;
    utils.array.each(parts, (p, index) => {
      if (!data || !p) {
        throw new Error(`armstrong-react: Your form binding ${dataPath} is incorrect! setValue failed on '${p}' (part: ${index})`);
      }
      if (index === lastIndex) {
        data[p] = value;
        return
      }
      data = data[p];
    })
  }
}
