import chalk from "chalk";
import AngularGenerator from "generator-jhipster/generators/angular";
import yosay from 'yosay';
import { loadAngularGeneratorOpts } from './prompts.mjs';
import { deleteUnwantedFiles, processApiServersforClinet, loadDeploymentConfigs } from "./utils.mjs";


export default class extends AngularGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(
        `This is a JHipster blueprint and should be used only like ${chalk.yellow(
          "jhipster --blueprints angular"
        )}`
      );
    }
  }

  get [AngularGenerator.INITIALIZING]() {
    return {
      ...super.initializing,
      async initializingTemplateTask() {},
    };
  }

  get [AngularGenerator.PROMPTING]() {
    return {
      // ...super.prompting,
      // async promptingTemplateTask() {},
      prompting() {
        this.log(
          yosay(
            `${chalk.red('angular-blueprint')}`
          )
        );
      },
      loadAngularGeneratorOpts
    };
  }

  get [AngularGenerator.CONFIGURING]() {
    return {
      // ...super.configuring,
      // async configuringTemplateTask() {},
    };
  }

  get [AngularGenerator.COMPOSING]() {
    return {
      // ...super.composing,
      // async composingTemplateTask() {},
    };
  }

  get [AngularGenerator.LOADING]() {
    return {
      // ...super.loading,
      // async loadingTemplateTask() {},
    };
  }

  get [AngularGenerator.PREPARING]() {
    return {
      ...super.preparing,
      // async preparingTemplateTask() {},
    };
  }

  get [AngularGenerator.CONFIGURING_EACH_ENTITY]() {
    return {
      // ...super.configuringEachEntity,
      // async configuringEachEntityTemplateTask() {},
    };
  }

  get [AngularGenerator.LOADING_ENTITIES]() {
    return {
      // ...super.loadingEntities,
      // async loadingEntitiesTemplateTask() {},
    };
  }

  get [AngularGenerator.PREPARING_EACH_ENTITY]() {
    return {
      // ...super.preparingEachEntity,
      // async preparingEachEntityTemplateTask() {},
    };
  }

  get [AngularGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return {
      // ...super.preparingEachEntityField,
      // async preparingEachEntityFieldTemplateTask() {},
    };
  }

  get [AngularGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return {
      // ...super.preparingEachEntityRelationship,
      // async preparingEachEntityRelationshipTemplateTask() {},
    };
  }

  get [AngularGenerator.POST_PREPARING_EACH_ENTITY]() {
    return {
      // ...super.postPreparingEachEntity,
      // async postPreparingEachEntityTemplateTask() {},
    };
  }

  get [AngularGenerator.DEFAULT]() {
    return {
      ...super.default,
      // async defaultTemplateTask() {},
    };
  }

  get [AngularGenerator.WRITING]() {
    return {
      ...super.writing,
    };
  }

  get [AngularGenerator.WRITING_ENTITIES]() {
    return {
      // ...super.writingEntities,
      // async writingEntitiesTemplateTask() {},
    };
  }

  get [AngularGenerator.POST_WRITING]() {
    return {
      // ...super.postWriting,
      // async postWritingTemplateTask() {},
    };
  }

  get [AngularGenerator.POST_WRITING_ENTITIES]() {
    return {
      // ...super.postWritingEntities,
      // async postWritingEntitiesTemplateTask() {},
    };
  }

  get [AngularGenerator.INSTALL]() {
    return {
      // ...super.install,
      // async installTemplateTask() {},
    };
  }

  get [AngularGenerator.POST_INSTALL]() {
    return {
      // ...super.postInstall,
      // async postInstallTemplateTask() {},
    };
  }

  get [AngularGenerator.END]() {
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
          { src: ".vscode/", dest: ".vscode/" },
          { src: "src/", dest: "src/" },
          { src: ".editorconfig", dest: ".editorconfig" },
          { src: "angular.json", dest: "angular.json" },
          { src: ".gitignore", dest: ".gitignore" },
          { src: "package.json", dest: "package.json" },
          { src: "README.md", dest: "README.md" },
          { src: "tsconfig.app.json", dest: "tsconfig.app.json" },
          { src: "tsconfig.json", dest: "tsconfig.json" },
          { src: "tsconfig.spec.json", dest: "tsconfig.spec.json" },
          { src: "src/assets/", dest: "src/assets/" },
          { src: "src/app/home", dest: "src/app/home" },
          { src: "src/app/layouts", dest: "src/app/layouts" },
          { src: "environment.ts", dest: "environment.ts" },
          { src: "environment.production.ts", dest: "environment.production.ts" },
        ];
        const conditionalTemplates = [
          { 
            condition:  this.oauth2,
            src:  "src/app/auth/",
            dest: "src/app/auth/"
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

