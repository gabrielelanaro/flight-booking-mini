You should prepare a pull request on GitHub using the `gh` command line tool by following these steps.

1. Review the uncommitted files to be able to appropriately describe the change
2. Search github issues if this is related to any of the recent issues using `gh` commandline
3. Create and checkout a new branch named after the work, e.g. `feature/my-change` unless we are already on the branch dedicated to this feature
4. Commit your changes with a descriptive message
5. Push the branch
6. Open a pull request using the branch and include:
   - A concise summary of the change
   - Testing notes (what you ran, or why tests were skipped)

When using `git add`, ALWAYS provide specific files, NEVER use `git add .`

Use the following PR template when running `gh pr create`.

<pr_template>
## Summary
[Explain what changed and why]

## Testing
- [ ] Tests were added or updated
- [ ] Tests were run locally (`npm test`, `pytest`, etc.)
- [ ] Manual QA performed (describe steps)

## Related Issues

- list of related issues
</pr_template>
