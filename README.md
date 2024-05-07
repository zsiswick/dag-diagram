# DAG Diagram

To see the DAG diagram example, no setup is required. Open the `index.html` file in a Chrome browser and you should see diagram animate in the viewport. Refresh to restart the animation.

## Setup

To modify the code and see changes in the browser, you will need to do the following:

- Add package dependencies: `npm install`
- Build the esbuild/typescript project: `npm run build`
- Refresh `index.html` in the browser and you should see any changes you made

The `app.ts` file contains the entry point for the main code execution. When you run `npm run build`, it converts the
typescript file to `index.js`, and that is imported into the `index.html` file.

## Testing

To run tests, execute the following:
`npm run test`
