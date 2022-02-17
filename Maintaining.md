> Warning: This note is for developer/maintainer of this package only

## Updating Package

- Make your changes
- Update `version` value on `package.json` file (and `user-agent` header version on `httpClient.js` file)
- To install dev dependencies `npm install --dev` on repo folder
- To run test, run `npm test` or `mocha`
- To run specific test
```
# specific single test
mocha --grep "fail to create transaction with zero gross_amount"
# or everything inside single `describe`
mocha --grep "Iris.js"
```
- To install the package locally `npm install /path/to/repo/folder`
- To update https://npmjs.com repo, run these on terminal:
```bash
npm publish
# You may be asked for login username and password for npmjs.com
```

## Updating Dependency via NPM Audit
This method useful to pass NPM Audit. I.e. to pass known security vulnerability of the npm package dependencies, but may not update dependency beyond patch version.
- run `npm audit`
- run `npm audit fix` to fix vuln & update deps if any
- run `npm test` to make sure nothing breaks
- Continue to [Updating Package](#updating-package) section above

### Further Updating Dependency
This method is useful to update dependency to the latest version, including major & minor version. Using updated major & minor version may means the dependency is more stable & have better feature. This was [based from this resource](https://stackoverflow.com/a/16074029).
- run `npm install -g npm-check-updates` to install npm-check-updates helper tool
- run `ncu -u` to auto check & update the npm package.json dependencies' version values
- run `npm install` to install the updated dependencies
- run `npm test` to make sure nothing breaks

## Dev & Test via Docker Compose

- To use docker-compose to test and run project, `cd` to repo dir
- Run `docker-compose up`, which basically run pytest on container
- Run `docker-compose down`, to clean up when done

<details>
<summary>Development Notes - (click to expand)</summary>
<article>

## TODO
- allow header override
- allow config x-override notification url header
- probably properly expose axios instance as public
- allow http client config such as timeout timer
- check & fix http client timeout config less than 10sec for test `able to throw connection failure exception`
- implement gopay checkout api
- implement cc subscription api
- write & create example app example for Iris
</article>
</details>
