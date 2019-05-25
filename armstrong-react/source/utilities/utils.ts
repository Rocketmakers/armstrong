import * as _ from "underscore";
import { IArrayUtils, IObjectUtils, IUtils } from "./definitions";
import { UnderscoreArrayUtils } from "./underscore/arrayUtils";
import { UnderscoreObjectUtils } from "./underscore/objectUtils";

class AppUtils implements IUtils {
  constructor(
    public object: IObjectUtils,
    public array: IArrayUtils) { }
}

export const utils: IUtils = new AppUtils(
  new UnderscoreObjectUtils(),
  new UnderscoreArrayUtils())
