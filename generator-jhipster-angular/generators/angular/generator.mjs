import chalk from "chalk";
import AngularGenerator from "generator-jhipster/generators/angular";
import yosay from 'yosay';
import { loadAngularGeneratorOpts } from './prompts.mjs';
import { deleteUnwantedFiles, processApiServersforClinet, loadDeploymentConfigs, loadServicesWithAndWithOutDB } from "./utils.mjs";


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
        let {servicesWithDB, servicesWithOutDB} = loadServicesWithAndWithOutDB.call(this);
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
          servicesWithDB: servicesWithDB,
          servicesWithOutDB: servicesWithOutDB,
        };
        const templatePaths = [
          { src: ".vscode/", dest: ".vscode/" },
          { src: "src/favicon.ico", dest: "src/favicon.ico" },
          { src: "src/index.html", dest: "src/index.html" },
          { src: "src/main.ts", dest: "src/main.ts" },
          { src: "src/styles.css", dest:"src/styles.css" },
          { src: "src/assets/", dest: "src/assets/" },
          { src: "src/app/home", dest: "src/app/home" },
          { src: "src/app/layouts/", dest: "src/app/layouts/" },
          { src: "src/app/app-routing.module.ts", dest: "src/app/app-routing.module.ts" },
          { src: "src/app/app.component.css", dest: "src/app/app.component.css" },
          { src: "src/app/app.component.html", dest: "src/app/app.component.html" },
          { src: "src/app/app.component.spec.ts", dest: "src/app/app.component.spec.ts" },
          { src: "src/app/app.component.ts", dest: "src/app/app.component.ts" },
          { src: "src/app/app.module.ts", dest: "src/app/app.module.ts" },
          { src: ".editorconfig", dest: ".editorconfig" },
          { src: ".gitignore", dest: ".gitignore" },
          { src: "angular.json", dest: "angular.json" },
          { src: "Dockerfile", dest: "Dockerfile" },
          { src: "environment.production.ts", dest: "environment.production.ts" },
          { src: "environment.ts", dest: "environment.ts" },
          { src: "nginx.conf", dest: "nginx.conf" },
          { src: "package.json", dest: "package.json" },
          { src: "README.md", dest: "README.md" },
          { src: "tsconfig.app.json", dest: "tsconfig.app.json" },
          { src: "tsconfig.json", dest: "tsconfig.json" },
          { src: "tsconfig.spec.json", dest: "tsconfig.spec.json" }          
        ];
        const conditionalTemplates = [
          { 
            condition:  this.oauth2,
            src:  "src/app/auth/",
            dest: "src/app/auth/"
          },
          { 
            condition: this.oauth2,
            src:  "docker/realm-config/",
            dest: "docker/realm-config/"
          },
          { 
            condition: this.oauth2,
            src:  "docker/keycloak.yml",
            dest: "docker/keycloak.yml"
          },
          { 
            condition: (servicesWithOutDB.length > 0),
            src:  "src/app/ping/",
            dest: "src/app/ping/",
          },
          { 
            condition: (apiServers.length > 0),
            src:  "src/app/swagger/",
            dest: "src/app/swagger/",
          },
          { 
            condition: (apiServers.length > 0),
            src:  "src/app/layouts/navbar/swagger-dropdown.component.ts",
            dest: "src/app/layouts/navbar/swagger-dropdown.component.ts",
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

