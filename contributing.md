# Contributing

## Contribution Types

### Report Bugs

Report bugs at <https://github.com/HBPMedical/hbpmip/gateway/issues>.

If you are reporting a bug, please include:

-   Your operating system name and version.
-   Any details about your local setup that might be helpful in
    troubleshooting.
-   Detailed steps to reproduce the bug.

### Fix Bugs

Look through the GitHub issues for bugs. Anything tagged with \"bug\"
and \"help wanted\" is open to whoever wants to implement it.

### Implement Features

Look through the GitHub issues for features. Anything tagged with
\"enhancement\" and \"help wanted\" is open to whoever wants to
implement it.

### Write Documentation

The stack could always use more documentation, whether as
part of the official docs, in docstrings, or even
on the web in blog posts, articles, and such.

### Submit Feedback

The best way to send feedback is to create an issue at
<https://github.com/HBPMedical/hbpmip/gateway/issues>.

If you are proposing a feature:

-   Explain in detail how it would work.
-   Keep the scope as narrow as possible, to make it easier to
    implement.
-   Remember that this is a volunteer-driven project, and that
    contributions are welcome :)

## Get Started!

Ready to contribute? Here\'s how to set up the gateway for
local development [https://mip-front.gitbook.io/mip-gateway-doc/](https://mip-front.gitbook.io/mip-gateway-doc/)

### Build & Releases

Build and releases are managed by GitLab CI and [Semantic Release](https://github.com/semantic-release/semantic-release).

Please keep your commit the most specific to a change it describes. It
is highly advice to track unstaged files with `git status`, add a file
involved in the change to the stage one by one with `git add <file>`.
The use of `git add .` is highly disencouraged. When all the files for a
given change are staged, commit the files with a brieg message using
`git commit -m "<type>[optional scope]: <description>"` that describes
your change and where `<type>` can be `fix` for a bug fix, `feat` for a
new feature, `refactor` for a code change that neither fixes a bug nor
adds a feature, `docs` for documentation, `ci` for continuous
integration testing, and `test` for adding missing tests or correcting
existing tests. This follows the Angular conventional commits, please
see <https://www.conventionalcommits.org/en/v1.0.0-beta.4/> for more
details.
:::

5.  When you\'re done making changes, push your branch to GitHub:

        git push origin name-of-your-bugfix-or-feature

6.  Submit a pull request through the GitHub website.

    Please make sure that the pull request is made against the `dev`
    branch. The `master` branch is used for the stable version releases.
    :::

### Pull Request Guidelines

Before you submit a pull request, check that it meets these guidelines:

1.  Make sure that the tests pass
