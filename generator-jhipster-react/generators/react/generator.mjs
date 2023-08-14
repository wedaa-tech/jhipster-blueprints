import chalk from "chalk";
import yosay from 'yosay';
import ReactGenerator from "generator-jhipster/generators/react";
import { loadReactGeneratorOpts } from './prompts.mjs';
import { deleteUnwantedFiles, processApiServersforClinet, loadDeploymentConfigs } from "./utils.mjs";

export default class extends ReactGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(
        `This is a JHipster blueprint and should be used only like ${chalk.yellow(
          "jhipster --blueprints react"
        )}`
      );
    }
  }

  get [ReactGenerator.INITIALIZING]() {
    return {
      ...super.initializing,
      async initializingTemplateTask() { },
    };
  }

  get [ReactGenerator.PROMPTING]() {
    return {
      // ...super.prompting,
      // async promptingTemplateTask() {},
      prompting() {
        this.log(
          yosay(
            `${chalk.red('react-blueprint')}`
          )
        );
      },
      loadReactGeneratorOpts
    };
  }

  get [ReactGenerator.CONFIGURING]() {
    return {
      // ...super.configuring,
      // async configuringTemplateTask() {},
    };
  }

  get [ReactGenerator.COMPOSING]() {
    return {
      // ...super.composing,
      // async composingTemplateTask() {},
    };
  }

  get [ReactGenerator.LOADING]() {
    return {
      // ...super.loading,
      // async loadingTemplateTask() {},
    };
  }

  get [ReactGenerator.PREPARING]() {
    return {
      // ...super.preparing,
      // async preparingTemplateTask() {},
    };
  }

  get [ReactGenerator.CONFIGURING_EACH_ENTITY]() {
    return {
      // ...super.configuringEachEntity,
      // async configuringEachEntityTemplateTask() {},
    };
  }

  get [ReactGenerator.LOADING_ENTITIES]() {
    return {
      // ...super.loadingEntities,
      // async loadingEntitiesTemplateTask() {},
    };
  }

  get [ReactGenerator.PREPARING_EACH_ENTITY]() {
    return {
      // ...super.preparingEachEntity,
      // async preparingEachEntityTemplateTask() {},
    };
  }

  get [ReactGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return {
      // ...super.preparingEachEntityField,
      // async preparingEachEntityFieldTemplateTask() {},
    };
  }

  get [ReactGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return {
      // ...super.preparingEachEntityRelationship,
      // async preparingEachEntityRelationshipTemplateTask() {},
    };
  }

  get [ReactGenerator.POST_PREPARING_EACH_ENTITY]() {
    return {
      // ...super.postPreparingEachEntity,
      // async postPreparingEachEntityTemplateTask() {},
    };
  }

  get [ReactGenerator.DEFAULT]() {
    return {
      // ...super.default,
      // async defaultTemplateTask() {},
    };
  }

  get [ReactGenerator.WRITING]() {
    return {
      ...super.writing,
    };
  }

  get [ReactGenerator.WRITING_ENTITIES]() {
    return {
      // ...super.writingEntities,
      // async writingEntitiesTemplateTask() {},
    };
  }

  get [ReactGenerator.POST_WRITING]() {
    return {
      // ...super.postWriting,
      // async postWritingTemplateTask() {},
    };
  }

  get [ReactGenerator.POST_WRITING_ENTITIES]() {
    return {
      // ...super.postWritingEntities,
      // async postWritingEntitiesTemplateTask() {},
    };
  }

  get [ReactGenerator.INSTALL]() {
    return {
      // ...super.install,
      // async installTemplateTask() {},
    };
  }

  get [ReactGenerator.POST_INSTALL]() {
    return {
      // ...super.postInstall,
      // async postInstallTemplateTask() {},
    };
  }

  get [ReactGenerator.END]() {
    return {
      endTemplateTask() {
        deleteUnwantedFiles.call(this);
      },
      writing() {
        let apiServers = processApiServersforClinet.call(this);
        let deploymentConfig = loadDeploymentConfigs.call(this);
        const templateVariables = {
          serverPort: this.serverPort,
          packageName: this.packageName,
          baseName: this.baseName,
          oauth2: this.oauth2,
          eureka: this.eureka,
          rabbitmq: this.rabbitmq,
          postgresql: this.postgress,
          mongodb: this.mongodb,
          apiServers: apiServers,
          deploymentConfig: deploymentConfig,
        };
        const templatePaths = [
          { src: "public/", dest: "public/" },
          { src: "src/assets/", dest: "src/assets/" },
          { src: "src/components/", dest: "src/components/" },
          { src: "src/App.css", dest: "src/App.css" },
          { src: "src/App.js", dest: "src/App.js" },
          { src: "src/App.test.js", dest: "src/App.test.js" },
          { src: "src/index.css", dest: "src/index.css" },
          { src: "src/index.js", dest: "src/index.js" },
          { src: "src/logo.svg", dest: "src/logo.svg" },
          { src: "src/reportWebVitals.js", dest: "src/reportWebVitals.js" },
          { src: "src/setupTests.js", dest: "src/setupTests.js" },
          { src: ".dockerignore", dest: ".dockerignore" },
          { src: ".env", dest: ".env" },
          { src: ".env.production", dest: ".env.production" },
          { src: "Dockerfile", dest: "Dockerfile" },
          { src: "nginx.conf", dest: "nginx.conf" },
          { src: ".gitignore", dest: ".gitignore" },
          { src: "package.json", dest: "package.json" },
          { src: "README.md", dest: "README.md" },
        ];
        const conditionalTemplates = [
          { 
            condition: this.oauth2,
            src:  "src/config/auth/",
            dest: "src/config/auth/"
          },
        ];
        templatePaths.forEach(({ src, dest }) => {
          this.fs.copyTpl(
            this.templatePath(src),
            this.destinationPath(dest),
            templateVariables
          );
        });
        conditionalTemplates.forEach(({ condition, src, dest }) => {
          if (condition) {
            this.fs.copyTpl(
              this.templatePath(src),
              this.destinationPath(dest),
              templateVariables
            );
          }
        });
      }
    };
  }
}
