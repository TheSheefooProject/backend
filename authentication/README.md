# Sheefoo Backend code

Notes:

1. Remember that the codebase is using TypeScript, and as such should follow the appropriate patterns.
2. Not needed, but try to rebase and squash your PR's into one commit, it makes it easier to revert stuff if need be. As well as keep track. e.g `git rebase -i origin/main`
## Things you need to install

This project uses primarily nodejs, but the typescript version. But on top of that you also need some additional software:

1. Docker - Used for local development (whilst we wait for an azure account)
2. VScode - Uses Vscode plugins
   Install the following extensions for vscode
    1. `prettier`
    2. `eslint`
    3. `better comments`
    4. I also recommend going into vscode settings, and turning on format on save. It just makes everything neat.
3. Nodejs - So you can install the LTS version of node, but we wont depend on it that much, all we really need is npm. Node 10 is best tho. Then after install do `npm install -g typescript ts-node`. Make sure `ts-node -v` gives back 10.0.0 btw.
4. Clone the repo and do `npm install`
5. `npm run dev` -> This will start the server locally (eventually not currently setup :p, all you cna do is use the below)

## Code structure

To enable API versions, the server is currently setup such that in the `src` file there is a folder with say v1, this contains appropriate data for the v1 of the API. The `server.ts` file is the main startup file in the src folder, the `app.js` file configures the express server.

Folder structure within the src folder, generally tries to follow the MVC model structure:

**Routes**: Essentially where we define the different api endpoints. When the user wants to add in a new route and do some calculation it should go in here.

**Controller**: Put code here that has to do with working out what a user wants, and deciding what to give them, working out whether they are logged in, whether they should see certain data, etc. In the end, the controller looks at requests and works out what data (Models) to show. Keep your controllers skinny.

**Model**: Your model should be where all your code that relates to your data (the entities that make up your site e.g. Users, Post, Accounts, Friends etc.) lives. If code needs to save, update or summarise data related to your entities, put it here. It will be re-usable across your Views and Controllers. All the user data stuff should go in here.

**Helper**: The majority of the processing should be done within the model however if anything else is needed at it in here.
