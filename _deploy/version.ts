import * as branchName from "current-git-branch";

import { exec } from "./common";

export async function version() {
  const branch = branchName();

  if (branch === "develop") {
    // do a prerelease
    await exec("npm",
      [
        "version",
        "prerelease",
        "--preid=alpha"
      ], false)
  }
}

version();