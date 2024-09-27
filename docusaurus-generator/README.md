# Docusaurus Generator

- Docusaurus Generator is generated via Yeoman generator.

- Yeoman generators are scaffolding tools that help automate the setup of new projects by generating boilerplate code and structure based on predefined templates.

## Install node modules 

```
npm install
```

## Link Docusaurus Generator

- Create a symbolic Link for the Wedaa Version of docusaurus generator to global node_modules.

- Use below given commands:

```
npm link
```

## Usage

- Run Yeoman Generator to scaffold a sample Docusaurus application.

-  Input support: `json file`

- Example json file.

```
{
    "applicationName": "Test_gen111",
    "serverPort": 5000
}
```

- As of now Docusaurus Generator supports two input keys: `applicationName`, `serverPort`
 
- Create a sample json file with these two keys.

- Use the below cmd to run the Docusaurus Generator:

```
yo docusaurus --file sample.json
```
