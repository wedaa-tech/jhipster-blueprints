# Go Micro Blueprint 

WeDAA version Go Micro blueprint [generator-jhipster-gomicro](https://github.com/wedaa-tech/jhipster-blueprints/tree/main/generator-jhipster-gomicro)


## Linking with Jhipster

- Update jhipster dependencies in package.json 

```
  "dependencies": {
    "chalk": "4.1.2",
    "generator-jhipster": "file:/usr/src/app/generator-jhipster",
    "yosay": "^2.0.2"
  }
```
- Above given dependencies block need to be updated like this:

```
"dependencies": {
    "chalk": "4.1.2",
    "generator-jhipster": "file:/Users/craxkumar/WeDAA/generator-jhipster",
    "yosay": "^2.0.2"
  }
```

- `file:/Users/craxkumar/WeDAA/generator-jhipster` this is the absolute path of generator-jhipster, which will be different from machine to machine. Make sure to change it accordingly.

- This will allow the blueprint to refer the locally installed WeDAA version jhpister.

- **NOTE**: Never push the local filepath to github.

## Install node modules 

```
npm install
```

## Link Go Micro Blueprint

- Create a symbolic Link for the Wedaa Version of Go Micro blueprint to global node_modules.

- Use below given commands:

```
npm link
```
```
npm link generator-jhipster-gomicro
```

- This will link the global symlinked package to the local project's node_modules

- For more details refer [Official blueprints](https://www.jhipster.tech/modules/official-blueprints/)