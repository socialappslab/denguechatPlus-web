---
name: release
description: >-
  Use when the user wants to cut, ship, publish, or release a production
  version of DengueChatPlus Web, including requests such as “ship 1.9.0” or
  “get this to production.” It bumps the app version, merges develop into main,
  pushes the tag, and publishes the matching GitHub Release. Not for preview
  deploys, ordinary feature pull requests, or dependency-only version changes.
---

# Release

Publish a production version through a `develop` → `main` pull request.

## Repository conventions

- `package.json` is the only application-version source of truth. Update its
  top-level `version` field only; do not change dependency versions or the lockfile
  for a release bump.
- Releases are cut directly from `develop`; do not create a `release/X.Y.Z`
  branch.
- Release tags are `vX.Y.Z`. Older unprefixed tags are legacy records; never
  move, overwrite, or use them as the convention for new releases.
- `main` is the production branch. Do not infer deployment behavior beyond what
  the repository or its configured hosting service confirms.

## 1. Preflight

Start from the current remote `develop` branch and preserve any user changes.

```bash
git fetch origin develop main --tags
git status --porcelain              # must be empty
git switch develop
git pull --ff-only origin develop
git log --oneline origin/main..origin/develop
```

Stop and tell the user if the working tree is dirty, `develop` cannot be
fast-forwarded, or the range is empty. Do not stash, discard, or commit the
user's changes. Confirm that no tag already exists for the selected version:

```bash
git rev-parse -q --verify "refs/tags/vX.Y.Z"
```

Treat a successful result as a collision and stop.

## 2. Choose the version

Read the current version from `package.json` and summarize the commits in the
preflight range. Suggest a semantic-version bump (features normally mean minor;
fixes only normally mean patch), then get the user's confirmation of the exact
version before changing files.

## 3. Bump and validate `develop`

Edit only `package.json`'s `version` field on the updated `develop` branch.

```bash
pnpm lint
pnpm build
git add package.json
git commit -m "chore: bump app version to X.Y.Z"
git push origin develop
```

If validation fails, stop and report the failure. Do not bypass it unless the
user explicitly directs that decision.

## 4. Open the release pull request

Create a pull request from `develop` to `main`. Base the changelog on
`git log --oneline origin/main..HEAD`, omitting merge commits, and keep it short
and user-facing.

```bash
gh pr create --base main --head develop --title "Release vX.Y.Z" --body "..."
```

## 5. Merge only with explicit approval

Stop after creating the pull request and obtain explicit user confirmation
before merging it. Merging to `main` is the production-release action.

After approval, use the repository's established merge-commit style:

```bash
gh pr merge <number> --merge
git fetch origin main
```

Verify that `origin/main` contains the release version before tagging:

```bash
git show origin/main:package.json
```

## 6. Create, push, and publish the release

Point the tag at the merged `main` commit, push it, then create the GitHub
Release from that already-pushed tag.

```bash
git tag vX.Y.Z origin/main
git push origin vX.Y.Z
gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes
```

If tag push or GitHub Release creation fails, stop and report the exact state;
do not retag, force-push, or retry destructive operations without resolving the
cause. If `gh release create` reports that the release already exists, inspect
it and report that state rather than overwriting it.

## 7. Sync `develop`

The merge commit on `main` must return to `develop` so the branches stay aligned.

```bash
git switch develop
git pull --ff-only origin develop
git merge --ff-only origin/main
git push origin develop
```

If the fast-forward merge fails, stop and tell the user; someone may have
pushed to `develop` during the release.

## 8. Report

Give the user the released version, pull-request URL, tag, GitHub Release URL,
and validation results. Mention any deployment status only when it can be
verified from the configured hosting service.
