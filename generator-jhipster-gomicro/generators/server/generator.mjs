import chalk from 'chalk';
import yosay from 'yosay';
import ServerGenerator from 'generator-jhipster/generators/server';
import { askForServerSideOpts } from './prompts.mjs';
import { loadCommunicationConfigs, findConfigByBaseName, deleteUnwantedFiles,loadAppConfigs,loadDeploymentConfigs,processApiServersforClinet } from './util.mjs';

export default class extends ServerGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints gomicro')}`);
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
        this.log(yosay(`${chalk.red('gomicro-blueprint')}`));
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
      // ...super.end,
      // async endTemplateTask() {},
      endTemplateTask() {
        deleteUnwantedFiles.call(this);
      },
      writing() {
        let appConfigs =  loadAppConfigs.call(this);
        let apiServers = processApiServersforClinet.call(this);
        let deploymentConfig = loadDeploymentConfigs.call(this);
        const matchingScenarios = findConfigByBaseName(this.baseName);
        if (matchingScenarios.length > 0) {
          var restServer = [],
            restClient,
            rabbitmqServer = [],
            rabbitmqClient = [],
            rabbitmq = false;

          for (var options of matchingScenarios) {
            if (options.framework === 'rest-api') {
              if (options.server) {
                restServer.push(options.server);
              }
              if (options.client) {
                restClient = options.client;
              }
            } else if (options.framework === 'rabbitmq') {
              rabbitmq = true;
              if (options.server) {
                rabbitmqServer.push(options.server);
              }
              if (options.client) {
                rabbitmqClient.push(options.client);
              }
            }
          }
        }
        const templateVariables = {
          serverPort: this.serverPort,
          packageName: this.packageName,
          baseName: this.baseName,
          auth: this.auth,
          eureka: this.eureka,
          rabbitmq: rabbitmq,
          postgresql: this.postgress,
          mongodb: this.mongodb,
          databasePort: this.databasePort,
          restServer: restServer,
          restClient: restClient,
          rabbitmqServer: rabbitmqServer,
          rabbitmqClient: rabbitmqClient,
          apiServers: apiServers,
          deploymentConfig: deploymentConfig,
          minikube: appConfigs[0]['generator-jhipster'].minikube || false,
        };

        const templatePaths = [
          { src: 'src/proto', dest: 'src/proto' },
          { src: 'src/pb', dest:'src/pb' },
          { src: 'src/go.mod', dest: 'src/go.mod' },
          { src: 'src/main.go', dest: 'src/main.go' },
          { src: 'Dockerfile', dest: 'Dockerfile' },
          { src: 'README.md', dest: 'README.md' },
          { src: 'src/config', dest: 'src/config' },
          { src: 'src/controllers/base.go', dest: 'src/controllers/base.go' },
          { src: 'src/controllers/management.go', dest: 'src/controllers/management.go' },
          { src: 'docker/app.yml', dest: 'docker/app.yml'},
        ];
        const conditionalTemplates = [
          { condition: this.auth, src: 'src/auth', dest: 'src/auth' },
          { condition: this.auth, src: 'docker/realm-config', dest: 'docker/realm-config' },
          { condition: this.auth, src: 'docker/keycloak.yml', dest: 'docker/keycloak.yml' },
          { condition: this.postgress, src: 'src/repository/notes.go', dest: 'src/repository/notes.go' },
          { condition: this.postgress, src: 'src/handler/notes.go', dest: 'src/handler/notes.go' },
          { condition: this.postgress, src: 'src/db/postgres.go', dest: 'src/db/postgres.go' },
          { condition: this.postgress, src: 'src/migrate', dest: 'src/migrate' },
          { condition: this.postgress, src: 'docker/postgresql.yml', dest: 'docker/postgresql.yml' },
          { condition: this.postgress||this.mongodb, src: 'src/controllers/notes.go', dest: 'src/controllers/notes.go' },
          { condition: this.mongodb, src: 'src/repository/mongonotes.go', dest: 'src/repository/notes.go' },
          { condition: this.mongodb, src: 'src/handler/mongonotes.go', dest: 'src/handler/notes.go' },
          { condition: this.mongodb, src: 'src/db/mongodb.go', dest: 'src/db/mongodb.go' },
          { condition: this.mongodb, src: 'docker/mongodb.yml', dest: 'docker/mongodb.yml' },
          { condition: this.eureka, src: 'src/serviceregistry/helper', dest: 'src/serviceregistry/helper' },
          { condition: restServer?.length||restClient, src: 'src/controllers/communication.go', dest: 'src/controllers/communication.go' },
          {
            condition: this.eureka,
            src: 'src/serviceregistry/discoverymanager.go',
            dest: 'src/serviceregistry/discoverymanager.go',
          },
          {
            condition: this.eureka,
            src: 'src/serviceregistry/registrationmanager.go',
            dest: 'src/serviceregistry/registrationmanager.go',
          },
          {
            condition: this.eureka,
            src: 'src/serviceregistry/eurekaregistrationmanager.go',
            dest: 'src/serviceregistry/eurekaregistrationmanager.go',
          },
          { condition: this.eureka, src: 'docker/central-server-config', dest: 'docker/central-server-config' },
          { condition: this.eureka, src: 'docker/jhipster-registry.yml', dest: 'docker/jhipster-registry.yml' },
          { condition: rabbitmq, src: 'docker/rabbitmq.yml', dest: 'docker/rabbitmq.yml' },
          {
            condition: restServer?.length,
            src: 'src/rest/restclient.go',
            dest: 'src/communication/rest/restclient.go',
          },
          {
            condition:restServer?.length||rabbitmqClient?.length,
            src: 'COMMUNICATION.md',
            dest: 'COMMUNICATION.md',
          },
          {
            condition:rabbitmqServer?.length||rabbitmqClient?.length||this.eureka||this.auth||this.mongodb||this.postgresql,
            src: 'docker/services.yml',
            dest: 'docker/services.yml',
          }
        ];
        templatePaths.forEach(({ src, dest }) => {
          this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest), templateVariables);
        });
        conditionalTemplates.forEach(({ condition, src, dest }) => {
          if (condition) {
            this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest), templateVariables);
          }
        });
        if (rabbitmqServer?.length) {
          for (var i = 0; i < rabbitmqServer.length; i++) {
            var server = rabbitmqServer[i].charAt(0).toUpperCase() + rabbitmqServer[i].slice(1);
            var client = this.baseName.charAt(0).toUpperCase() + this.baseName.slice(1);
            this.fs.copyTpl(
              this.templatePath('src/rabbitmq/consumer.go'),
              this.destinationPath('src/communication/rabbitmq/' + 'rabbitmqconsumer' + server + 'to' + client + '.go'),
              {
                packageName: this.packageName,
                rabbitmqServer: server,
                rabbitmqClient: client,
                baseName: this.baseName,
              }
            );
          }
        }
        if (rabbitmqClient?.length) {
          for (var i = 0; i < rabbitmqClient.length; i++) {
            var server = this.baseName.charAt(0).toUpperCase() + this.baseName.slice(1);
            var client = rabbitmqClient[i].charAt(0).toUpperCase() + rabbitmqClient[i].slice(1);
            this.fs.copyTpl(
              this.templatePath('src/rabbitmq/producer.go'),
              this.destinationPath('src/communication/rabbitmq/' + 'rabbitmqproducer' + server + 'to' + client + '.go'),
              {
                packageName: this.packageName,
                rabbitmqClient: client,
                rabbitmqServer: server,
                baseName: this.baseName,
              }
            );
          }
        }
      },
    };
  }
}
