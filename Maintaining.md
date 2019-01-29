> Warning: This note is for developer/maintainer of this package only

## Updating Package

- Make your changes
- Update version on `package.json` file
- To install dev dependencies `npm install --dev` on repo folder
- To run test, run `npm test` or `mocha`
- To run specific test
```
mocha --grep "fail to create transaction with zero gross_amount"
```
- To install the package locally `npm install /path/to/repo/folder`
- To update https://npmjs.com repo, run these on terminal:
```bash
npm publish
# You may be asked for login username and password for npmjs.com
```
