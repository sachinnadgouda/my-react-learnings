This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

In the cdk directory, you can run: <br />
`cdk --version`<br />
`npm install`<br />
`npm run build`<br />
`cdk synth`<br />
`cdk deploy --profile profile`

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Important links followed <br />
1. profile creation <br />
	-- aws secret key <br />
	-- https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html <br />
2. ecr docker image push <br />
	-- after ecr creation go to ecr repo aws and get push command <br />
	-- https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html <br />
4. git token for ci/cd pipeline 65a45ed149bac7bcac4c66fb6ce0498e37446a02 <br />
	-- https://github.com/settings/tokens <br />
	-- https://docs.aws.amazon.com/codepipeline/latest/userguide/GitHub-create-personal-token-CLI.html <br />
5. add git awss token to secret manager <br />
	-- https://medium.com/@eoins/securing-github-tokens-in-a-serverless-codepipeline-dc3a24ddc356 <br />
	-- https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html <br />
6. manual step for setting up ecr, ecs, codepipeline <br />
	-- https://dev.to/mubbashir10/containerize-react-app-with-docker-for-production-572b <br />
7. cdk way for setting up infrastrcuture <br />
	-- for container http://aws-msg-app.ws.kabits.com/v3-deploying-backend/ <br />
	-- for git integration https://github.com/peerjako-aws/cdk-ecs-cicd/blob/master/cdk/lib/dev-pipeline-stack.ts
