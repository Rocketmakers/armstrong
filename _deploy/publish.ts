import * as branchName from "current-git-branch";
import * as prompts from "prompts"
import * as semver from "semver"

import { exec } from "./common";

export async function publish() {
  const branch = branchName();
  const preId = "alpha";

  await exec("git",
        [
          "checkout",
          "master"
        ], false)

  await exec("git",
        [
          "pull"
        ], false)

  const currentVersion = await exec("node",
    [
      "-p",
      "require('./armstrong-react/package.json').version"
    ],
    false,
    { output: true })

  console.log(`💪 Armstrong version ${currentVersion} [${branch}]`)

  const response = await prompts([
    {
      type: 'select',
      name: 'type',
      initial: 2,
      message: 'Which type of release are you doing?',
      choices: [
        { title: `Major [${semver.inc(currentVersion, "major")}]`, value: 'major' },
        { title: `Minor [${semver.inc(currentVersion, "minor")}]`, value: 'minor' },
        { title: `Patch [${semver.inc(currentVersion, "patch")}]`, value: 'patch' },
        { title: `Pre   [${semver.inc(currentVersion, "prerelease", preId)}]`, value: 'prerelease' }
      ],
    }
  ]);

  const releaseType: semver.ReleaseType = response.type;

  if (!releaseType) {
    return;
  }
  const newVersion = semver.inc(currentVersion, releaseType, preId)

  const confirmation = await prompts([
    {
      type: 'confirm',
      name: 'confirm',
      message: `New version will be ${newVersion} (${releaseType}). Is this ok?`,
      initial: 'y'
    }
  ])

  if (confirmation.confirm) {
    await exec("npm",
      [
        "version",
        releaseType,
        `--preid=${preId}`
      ], false, { cwd: 'armstrong-react', output: true });

    await exec("npm",
      [
        "version",
        releaseType,
        `--preid=${preId}`
      ], false)

    const pushConfirmation = await prompts([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Everything looks good. Would you like to push everything for publish now?`,
        initial: 'y'
      }
    ])

    if (pushConfirmation.confirm) {
      await exec("git",
        [
          "push",
          "--follow-tags"
        ], false)
    } else {
      console.log("No worries 😎. When you're happy just run 'git push --follow-tags' to start the publishing process.")
    }
  }
}

publish();