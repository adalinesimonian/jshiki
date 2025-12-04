# Contributing to jshiki

Thanks for the interest in contributing to jshiki! 🎉

This document goes over the process of contributing to jshiki and guidelines and tips on how to do so. Keep in mind that these are just guidelines and that not all contributions will always necessarily fit the mould — and that's okay! However, it would help if you always tried to follow these guidelines to the best of your ability.

[Documentation] | [Issues] | [Pull Requests]

**Table of Contents**

- [Workflow](#workflow)
- [Environment](#environment)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Documentation](#documentation)

## Workflow

Generally, the process of contributing to jshiki is as follows:

1. **Create a new issue** on the [issues] page. If you're also submitting a pull request, include a link to the pull request in the issue.
   - **For bugs:** the issue should describe the bug, provide a code snippet that reproduces the bug, include what the expected and actual behaviour is, as well as any other relevant information.
   - **For features:** the issue should describe the feature and its use cases and the motivation for implementing it. It should also include a code snippet that demonstrates the desired behaviour and any other relevant information.
1. **Submit a pull request** on the [pull requests] page.
   - **Provide a link to the issue** on the pull request.
   - **Describe the changes** you're making to the code.
   - **If the changes are substantial,** include a code snippet that demonstrates the desired behaviour and any other relevant information.
   - **If the changes are breaking,** make a note of that in the pull request.

## Environment

- Code is written in [Typescript].
  - This package provides types for the jshiki library, so pay mind to the code you write and any changes to the types that a consumer of the package will use.
- The package manager used is [Yarn].
  - You can use npm if you prefer, but we only accept Yarn lock files into the repository, and all scripts should work when run using Yarn. Therefore, we recommend you use Yarn.
- Tests are run using [Vitest].
  - _See [testing](#testing) for more information._
- Code is linted with [ESLint] and formatted with [Prettier].
  - _See [linting and formatting](#linting-and-formatting) for more information._
- Documentation is generated using [mkdocs] and [mkdocs-material], and API documentation is generated using [typedoc]. [mike] is used for versioning.
  - _See [documentation](#documentation) for more information._

## Testing

Any contributions to jshiki should be tested before being considered for inclusion in the main repository.

- Contributions with **new functionality** should provide new tests.
- Contributions that **change existing functionality** should also change any appropriate current tests and add new tests for cases that aren't covered by existing tests.
- Contributions that **fix bugs** should also fix any appropriate existing tests.
- **All contributions** should maintain:
  - **100% code coverage for unit tests**
  - **At least 90% and as much coverage as is reasonably possible** for functional tests

The following scripts help to run tests:

- `yarn test`: Runs all unit and functional tests.
- `yarn test:unit`: Runs all unit tests and fails if coverage is below 100%. Coverage reports are generated in the `coverage/unit` directory.
- `yarn test:functional`: Runs all functional tests and fails if coverage is below 90%, except for functions, which require 100% coverage. Coverage reports are generated in the `coverage/functional` directory.
- `yarn test-ci`: Runs all unit and functional tests with coverage and generates separate reports for each. Unlike the `test:*` scripts, this script **does not fail** if coverage is below the required threshold.

## Linting and Formatting

All code in jshiki should be linted and formatted with [ESLint] and [Prettier]. You can use the following scripts:

- `yarn lint`: Lints all files in the repository using ESLint and Prettier and checks types using Typescript — in that order. It fails if it encounters any linting errors or type errors.
- `yarn format`: Formats all files in the repository using ESLint and Prettier. Fails if ESLint finds any errors.

Make sure to lint and format your code before submitting a pull request. CI is configured to run these scripts automatically, failing the build if you miss a linting or formatting error.

## Documentation

You should document any user-facing change in the user guide and in any related documentation comments on public API points. jshiki uses [mkdocs] and [mkdocs-material] to generate a static docs site using written documentation and [typedoc] to generate API documentation.

Documentation is stored in the `docs` directory, The user guide is kept in the `docs/user-guide` directory, and API documentation is generated in the `docs/api` directory.

mkdocs runs on Python, so you'll need to install Python and pip to generate documentation. You'll also need to install [uv], the package manager. Once you've installed Python, pip, and uv, you can run `yarn install-docs-deps` to install the necessary dependencies to generate documentation (this script runs `uv pip install --upgrade -r requirements.txt`).

Once you have installed all dependencies, you can use these scripts to generate the documentation site:

- `yarn build-docs`: Builds the browser playground bundle, documentation, and API docs for development and outputs them to the `site` directory. Equivalent to running the following scripts in sequence:
  - `yarn build-docs:assets`: Bundles the browser-friendly jshiki build that powers the docs playground.
  - `yarn build-docs:api`: Builds API documentation and outputs it to the `docs/api` directory.
  - `yarn build-docs:docs`: Builds user guide documentation and outputs it to the `site` directory, along with a copy of whatever API docs are in the `docs/api` directory.
- `yarn watch-docs`: Watches code and the `docs` directory and rebuilds documentation, API docs, and the playground bundle when it detects changes. It serves the documentation at `http://localhost:8000`. Equivalent to running the following scripts in parallel:
  - `yarn watch-docs:assets`: Rebuilds the playground browser bundle when it detects changes.
  - `yarn watch-docs:api`: Watches code and rebuilds API docs in `docs/api` when it detects changes.
  - `yarn watch-docs:docs`: Watches the `docs` directory and rebuilds the documentation website in `site` when changes are detected.

Versioning is handled using [mike]; however, you don't need to run it manually. CI will build the documentation and run the versioning script for you once the code is committed to the main branch and when a new release is cut.

[documentation]: https://jshiki.io/main/user-guide
[issues]: https://github.com/adalinesimonian/jshiki/issues
[pull requests]: https://github.com/adalinesimonian/jshiki/pulls
[typescript]: https://www.typescriptlang.org/
[yarn]: https://yarnpkg.com/
[vitest]: https://vitest.dev/
[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
[mkdocs]: https://www.mkdocs.org/
[mkdocs-material]: https://squidfunk.github.io/mkdocs-material/
[typedoc]: https://typedoc.org/
[uv]: https://docs.astral.sh/uv/
[mike]: https://github.com/jimporter/mike
