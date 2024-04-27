import chalk from "chalk";
import yosay from 'yosay';
import ServerGenerator from "generator-jhipster/generators/server";
import { askForServerSideOpts } from './prompts.mjs';
import { loadCommunicationConfigs, findConfigByBaseName, deleteUnwantedFiles, loadAppConfigs, loadDeploymentConfigs, processApiServersforClinet } from './util.mjs';

export default class extends ServerGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(
        `This is a JHipster blueprint and should be used only like ${chalk.yellow(
          "jhipster --blueprints fastapi"
        )}`
      );
    }
  }

  get [ServerGenerator.INITIALIZING]() {
    return {
      // ...super.initializing,
      // async initializingTemplateTask() {},
    };
  }

  get [ServerGenerator.PROMPTING]() {
    return {
      // ...super.prompting,
      // async promptingTemplateTask() {},
      prompting() {
        // Have Yeoman greet the user.
        this.log(yosay(`${chalk.red('fastapi-blueprint')}`));
      },
      askForServerSideOpts,
      loadCommunicationConfigs,

    };
  }

  get [ServerGenerator.CONFIGURING]() {
    return {
      // ...super.configuring,
      // async configuringTemplateTask() {},
    };
  }

  get [ServerGenerator.COMPOSING]() {
    return {
      // ...super.composing,
      // async composingTemplateTask() {},
    };
  }

  get [ServerGenerator.LOADING]() {
    return {
      // ...super.loading,
      // async loadingTemplateTask() {},
    };
  }

  get [ServerGenerator.PREPARING]() {
    return {
      // ...super.preparing,
      // async preparingTemplateTask() {},
    };
  }

  get [ServerGenerator.CONFIGURING_EACH_ENTITY]() {
    return {
      // ...super.configuringEachEntity,
      // async configuringEachEntityTemplateTask() {},
    };
  }

  get [ServerGenerator.LOADING_ENTITIES]() {
    return {
      // ...super.loadingEntities,
      // async loadingEntitiesTemplateTask() {},
    };
  }

  get [ServerGenerator.PREPARING_EACH_ENTITY]() {
    return {
      // ...super.preparingEachEntity,
      // async preparingEachEntityTemplateTask() {},
    };
  }

  get [ServerGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return {
      // ...super.preparingEachEntityField,
      // async preparingEachEntityFieldTemplateTask() {},
    };
  }

  get [ServerGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return {
      // ...super.preparingEachEntityRelationship,
      // async preparingEachEntityRelationshipTemplateTask() {},
    };
  }

  get [ServerGenerator.POST_PREPARING_EACH_ENTITY]() {
    return {
      // ...super.postPreparingEachEntity,
      // async postPreparingEachEntityTemplateTask() {},
    };
  }

  get [ServerGenerator.DEFAULT]() {
    return {
      // ...super.default,
      // async defaultTemplateTask() {},
    };
  }

  get [ServerGenerator.WRITING]() {
    return {
      // ...super.writing,
    };
  }

  get [ServerGenerator.WRITING_ENTITIES]() {
    return {
      // ...super.writingEntities,
      // async writingEntitiesTemplateTask() {},
    };
  }

  get [ServerGenerator.POST_WRITING]() {
    return {
      // ...super.postWriting,
      // async postWritingTemplateTask() {},
    };
  }

  get [ServerGenerator.POST_WRITING_ENTITIES]() {
    return {
      // ...super.postWritingEntities,
      // async postWritingEntitiesTemplateTask() {},
    };
  }

  get [ServerGenerator.INSTALL]() {
    return {
      // ...super.install,
      // async installTemplateTask() {},
    };
  }

  get [ServerGenerator.POST_INSTALL]() {
    return {
      // ...super.postInstall,
      // async postInstallTemplateTask() {},
    };
  }

  get [ServerGenerator.END]() {
    return {
      ...super.end,
      async endTemplateTask() {
        deleteUnwantedFiles.call(this);
      },
      writing() {

        const templateVariables = {
          serverPort: this.serverPort,
          packageName: this.packageName,
          baseName: this.baseName,
          auth: this.auth,
          eureka: this.eureka,
          // rabbitmq: rabbitmq,
          postgresql: this.postgress,
          mongodb: this.mongodb,
          databasePort: this.databasePort,
          // restServer: restServer,
          // restClient: restClient,
          // rabbitmqServer: rabbitmqServer,
          // rabbitmqClient: rabbitmqClient,
          // apiServers: apiServers,
          // deploymentConfig: deploymentConfig,
          // minikube: appConfigs[0]['generator-jhipster'].minikube || false,
        };

        const templatePaths = [
          { src: 'app/api', dest: 'app/api' },
          { src: 'app/core/log_config.py', dest: 'app/core/log_config.py' },
          { src: 'app/services/app_details.py', dest: 'app/services/app_details.py' },
          { src: 'app/main.py', dest: 'app/main.py' },
          { src: 'app/.env', dest: 'app/.env' },
          { src: 'docker/', dest: 'docker/' },
          { src: '.dockerignore', dest: '.dockerignore' },
          { src: '.gitignore', dest: '.gitignore' },
          { src: 'Dockerfile', dest: 'Dockerfile' },
          { src: 'README.md', dest: 'README.md' },
          { src: 'requirements.txt', dest: 'requirements.txt' },
        ];

        const conditionalTemplates = [
          { condition: this.auth, src: 'app/core/auth.py', dest: 'app/core/auth.py' },
        ]

        templatePaths.forEach(({ src, dest }) => {
          this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest), templateVariables);
        });

        conditionalTemplates.forEach(({ condition, src, dest }) => {
          if (condition) {
            this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest), templateVariables);
          }
        });

      },
    };
  }
}
