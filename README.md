<p align="center">
  <a href="https://github.com/muchobien/scoped-env/actions/workflows/codeql-analysis.yml"><img src="https://github.com/muchobien/scoped-env/actions/workflows/codeql-analysis.yml/badge.svg?branch=main" alt="CodeQL"></a>
<a href="https://github.com/muchobien/scoped-env/actions/workflows/test.yml"><img src="https://github.com/muchobien/scoped-env/actions/workflows/test.yml/badge.svg?branch=main" alt="build-test"></a>
</p>

# "Scoped Env" Action For GitHub Actions

A github action to select correct environments based on scope, e.g. `production` or `staging`.

## Usage

Add the following step to your workflow:

```yaml
- name: 'Select correct scope environment variables'
  uses: muchobien/scoped-env@v1
  with:
    secrets: ${{ toJSON(secrets) }}
    scope: PROD
    includes: 'FROM_INCLUDES' # optional
    exporters: 'env,output' # default, optional
    overrides: 'false' # optional, default false (override existing environment variables)
```

## License Summary

This code is made available under the MIT license.
