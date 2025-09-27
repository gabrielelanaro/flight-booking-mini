You should prepare a pull request on GitHub using the `gh` command line tool by following these steps.

1. Review the uncommitted files to be able to appropriately describe the change
2. Create and checkout a new branch named after the work, e.g. `feature/my-change`.
3. Stage and commit your changes with a descriptive message (ALWAYS stage specific files, NEVER use `git add .`).
3. Open a pull request using the branch and include:
   - A concise summary of the change
   - Testing notes (what you ran, or why tests were skipped)

Use the following PR template when running `gh pr create`.

<pr_template>
## Summary
[Explain what changed and why]

## Testing
- [ ] Tests were added or updated
- [ ] Tests were run locally (`npm test`, `pytest`, etc.)
- [ ] Manual QA performed (describe steps)

</pr_template>
