# Jhipster Blueprints & Yeoman generators

The JHipster team maintains several official blueprints. These blueprints have two main goals:

- Enhance JHipster with new features using different languages and/or support

- Demonstrate how the main generator behavior can be modified to fit anyone’s needs

For more Infromation

Refer: [Official blueprints](https://www.jhipster.tech/modules/official-blueprints/)

## Prerequisites (Pre-installed)
* [Node.js](https://nodejs.org/en/download/)
* [Yeoman](https://yeoman.io/learning/index.html)
* [WeDAA Jhipster](https://github.com/wedaa-tech/generator-jhipster)

## Generating jhispter blueprint

- Create a folder with the following prefix "generator-jhipster-" followed by the generator/blueprint name.

- For example: 

```
mkdir generator-jhipster-go
```

- `cd` in to above created dir.

```
cd generator-jhipster-go
```

- Using jhipster blueprint generator to generate blueprint.

```
jhipster generate-blueprint
```

- Follow the instructions and fill the prompts as per the need.

![Alt text](https://i.imgur.com/yV91YGd.png)

# Overriding the existing jhipster generators

- Let's say we want to override server sub-generator,

- Select the server and press Enter

![Alt text](https://i.imgur.com/D5zNonh.png)

![Alt text](https://i.imgur.com/I4UnclC.png)

![Alt text](https://i.imgur.com/upBLebw.png)

![Alt text](https://i.imgur.com/oraYxUt.png)

---

## Linking blueprint to local Jhipster

- Once the blueprint is generated, Open package.json and update the 
`generator-jhipster` dependency with in dependencies block.

- It will be populated with the lastest stable version.

```
"generator-jhipster": "7.10.0"
```

- Point to Locally installed WeDAA version of  Jhispter.

```
"generator-jhipster": "file:/Users/craxkumar/WeDAA/generator-jhipster"
```

- `file:/Users/craxkumar/WeDAA/generator-jhipster` this is the absolute path of generator-jhipster, which will be different from machine to machine. Make sure to change it accordingly.

- This will allow the blueprint to refer the locally installed WeDAA version jhpister.

- **NOTE**: Never push the local filepath to github.

## Install & Link Blueprints

```
npm install
```
```
npm link 
```
```
npm link generator-jhipster-<blueprint_name>
```

- For example:

```
npm link generator-jhipster-go
```

## Usage

- Run Blueprint to scaffold a sample application.

-  Input support: `jdl file`

- Example jdl file.
```
application {
    config {
        baseName be,
        applicationType microservice,
        packageName com.cmi.tic,
        authenticationType oauth2,
        databaseType sql,
        prodDatabaseType postgresql,
        devDatabaseType postgresql,
        databasePort 5432
        serviceDiscoveryType eureka,
        serverPort 9001,
        blueprints [go]
    } 
}
```

- As of now blueprint supports these keys: [Available application configuration options](https://www.jhipster.tech/jdl/applications#available-application-configuration-options)

- additionaly it also support two more keys: `databasePort`, `logManagementType`

-  `blueprints [blueprint_name]` key is to be mentioned to use the blueprint.

 
- Create a sample jdl file with the above give content.

## need to update the version of 
        "yeoman-test": "8.0.0" 
        when we generate the blueprint !!
- additionaly it also support two more keys: `databasePort`, `logManagementType`

-  `blueprints [blueprint_name]` key is to be mentioned to use the blueprint.

 
- Create a sample jdl file with the above give content.

- Use the below cmd to run the jhipster with blueprint:

```
jhipster jdl sample.jdl --skip-install --skip-git --skip-jhipster-dependencies
```

- `--skip-install`: skip installation of node modules in the generated sample application.

- `--skip-git`: skip git initialization in the generated sample application.

- `--skip-jhipster-dependencies`: skip the inclusion of jhipster dependencies in the generated sample application.

**NOTE**

- This repository contains List of Jhipster Blueprints & Yeoman generators.

- For more information `cd` into specific blueprint or generator & Refer README.md
