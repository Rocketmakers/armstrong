import { IArrayUtils, IObjectUtils, IUtils } from "./definitions";
import { UnderscoreArrayUtils } from "./underscore/arrayUtils";
import { UnderscoreObjectUtils } from "./underscore/objectUtils";

class Utils implements IUtils {
  constructor(
    public object: IObjectUtils,
    public array: IArrayUtils) { }
}

export const utils: IUtils = new Utils(
  new UnderscoreObjectUtils(),
  new UnderscoreArrayUtils())
