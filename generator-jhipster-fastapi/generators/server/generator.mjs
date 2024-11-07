import chalk from "chalk";
import yosay from 'yosay';
import ServerGenerator from "generator-jhipster/generators/server";
import { askForServerSideOpts } from './prompts.mjs';
import { loadCommunicationConfigs, findConfigByBaseName, deleteUnwantedFiles, loadAppConfigs, loadDeploymentConfigs, processApiServersforClinet , loadServicesWithAndWithOutDB} from './util.mjs';

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
      // ...super.end,

      // async endTemplateTask() {}
      endTemplateTask() {  
        deleteUnwantedFiles.call(this);
      },
      writing() {
        let appConfigs = loadAppConfigs.call(this);
        let apiServers = processApiServersforClinet.call(this);
        let deploymentConfig = loadDeploymentConfigs.call(this);
        let {servicesWithDB, servicesWithoutDB} = loadServicesWithAndWithOutDB.call(this);
        
        const matchingScenarios = findConfigByBaseName(this.baseName);
        if (matchingScenarios.length > 0) {
          var restServer = [],
            restClient,
            rabbitmqServer = [],
            rabbitmqClient = []


        for (var options of matchingScenarios) {
          if (options.framework === 'rest-api') {
            if (options.server) {
              restServer.push(options.server);
            }
            if (options.client) {
              restClient = options.client;
            }
          } else if (options.framework === 'rabbitmq') {
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
          postgresql: this.postgress,
          mongodb: this.mongodb,
          databasePort: this.databasePort,
          restServer: restServer,
          restClient: restClient,
          rabbitmqServer: rabbitmqServer,
          rabbitmqClient: rabbitmqClient,
          servicesWithDB: servicesWithDB,
          servicesWithoutDB: servicesWithoutDB,
          apiServers: apiServers,
          deploymentConfig: deploymentConfig,
          rabbitmq: this.rabbitmq,

          minikube: appConfigs[0]['generator-jhipster'].minikube || false,
        };

        const templatePaths = [
          { src: 'app/api/routes', dest: 'app/api/routes' },
          { src: 'app/api/router_config.py', dest: 'app/api/router_config.py' },
          { src: 'app/core/log_config.py', dest: 'app/core/log_config.py' },
          { src: 'app/services/app_details.py', dest: 'app/services/app_details.py' },
          { src: 'app/main.py', dest: 'app/main.py' },
          { src: 'app/gunicorn_dev_config.py', dest: 'app/gunicorn_dev_config.py' },
          { src: 'app/gunicorn_prod_config.py', dest: 'app/gunicorn_prod_config.py' },
          { src: 'app/.env', dest: 'app/.env' },
          { src: '.dockerignore', dest: '.dockerignore' },
          { src: '.gitignore', dest: '.gitignore' },
          { src: 'Dockerfile', dest: 'Dockerfile' },
          { src: 'README.md', dest: 'README.md' },
          { src: 'requirements.txt', dest: 'requirements.txt' },
          { src: 'start.sh', dest: 'start.sh' },
        ];

        const conditionalTemplates = [
          { condition: this.auth, src: 'app/core/auth.py', dest: 'app/core/auth.py' },
          { condition: this.auth, src: 'docker/keycloak.yml', dest: 'docker/keycloak.yml' },
          { condition: this.auth, src: 'docker/realm-config/', dest: 'docker/realm-config/' },

          { condition: this.postgress, src: 'app/core/postgres.py', dest: 'app/core/postgres.py' },
          { condition: this.postgress, src: 'docker/postgresql.yml', dest: 'docker/postgresql.yml' }, 

          { condition: this.postgress, src: 'app/migrations/postgres/', dest: 'app/migrations/' }, 
          { condition: this.mongodb, src: 'app/migrations/mongodb/', dest: 'app/migrations/' },
          
          { condition: this.postgress, src: 'app/api/postgres/note_routes.py', dest: 'app/api/routes/note_routes.py' }, 
          { condition: this.mongodb, src: 'app/api/mongodb/note_routes.py', dest: 'app/api/routes/note_routes.py' },
          { condition: this.postgress, src: 'app/models/postgres/note.py', dest: 'app/models/note.py' }, 
          { condition: this.mongodb, src: 'app/models/mongodb/note.py', dest: 'app/models/note.py' },
          { condition: this.postgress, src: 'app/repository/postgres/note_repository.py', dest: 'app/repository/note_repository.py' }, 
          { condition: this.mongodb, src: 'app/repository/mongodb/note_repository.py', dest: 'app/repository/note_repository.py' },
          { condition: this.postgress, src: 'app/services/postgres/note_service.py', dest: 'app/services/note_service.py' },
          { condition: this.mongodb, src: 'app/services/mongodb/note_service.py', dest: 'app/services/note_service.py' },
          { condition: this.postgress, src: 'app/alembic.ini', dest: 'app/alembic.ini' }, 
          

          { condition: this.mongodb, src: 'app/core/mongodb.py', dest: 'app/core/mongodb.py' },
          { condition: this.mongodb, src: 'docker/mongodb.yml', dest: 'docker/mongodb.yml' },

          
          { condition: this.eureka, src: 'app/core/eureka.py', dest: 'app/core/eureka.py' }, 
          { condition: this.eureka, src: 'docker/jhipster-registry.yml', dest: 'docker/jhipster-registry.yml' }, 
          { condition: this.eureka, src: 'docker/central-server-config/', dest: 'docker/central-server-config/' }, 


          { condition: this.rabbitmq, src: 'docker/rabbitmq.yml', dest: 'docker/rabbitmq.yml' },
          { condition: (( this.rabbitmq && rabbitmqClient.length > 0)), src: 'app/core/rabbitmq/rabbitmq_producer.py', dest: 'app/core/rabbitmq/rabbitmq_producer.py' }, 
          { condition: (( this.rabbitmq && rabbitmqServer.length > 0)), src: 'app/core/rabbitmq/rabbitmq_consumer.py', dest: 'app/core/rabbitmq/rabbitmq_consumer.py' }, 

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
