import chalk from "chalk";
import ReactGenerator from "generator-jhipster/generators/react";
import { deleteUnwantedFiles, processApiServersforClinet, loadDeploymentConfigs, loadServicesWithAndWithOutDB, loadAppConfigs } from "./utils.mjs";
import { loadReactGeneratorOpts } from './prompts.mjs';
import yosay from 'yosay'

export default class extends ReactGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(
        `This is a JHipster blueprint and should be used only like ${chalk.yellow(
          "jhipster --blueprints nextjs"
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
            `${chalk.red('nextjs-blueprint')}`
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
    //   ...super.writing,
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
        let appConfigs =  loadAppConfigs.call(this);
        let deploymentConfig = loadDeploymentConfigs.call(this);
        let {servicesWithDB, servicesWithOutDB} = loadServicesWithAndWithOutDB.call(this);
        const templateVariables = {
          serverPort: this.serverPort,
          packageName: this.packageName,
          baseName: this.baseName,
          oauth2: this.oauth2,
          apiServers: apiServers,
          deploymentConfig: deploymentConfig,
          servicesWithDB: servicesWithDB,
          servicesWithOutDB: servicesWithOutDB,
          nodePort: this.nodePort,
          minikube: appConfigs[0]['generator-jhipster'].minikube || false
        };
        
        const templatePaths = [
          { src: "public/", dest: "public/" },          
          { src: ".eslintrc.json", dest: ".eslintrc.json" },
          { src: ".gitignore", dest: ".gitignore" },          
          { src: "jsconfig.json", dest: "jsconfig.json" },          
          { src: "next.config.mjs", dest: "next.config.mjs" },          
          { src: "package-lock.json", dest: "package-lock.json" },          
          { src: "package.json", dest: "package.json" },          
		      {src :".env",dest:".env"},
          {src:'Dockerfile',dest:'Dockerfile'},
          {src:'.env.production',dest:'.env.production'},
          {src:'src/app/favicon.ico',dest:'src/app/favicon.io'},
          {src:'src/app/globals.css',dest:'src/app/globals.css'},
          {src:'src/app/layout.js',dest:'src/app/layout.js'},
          {src:'src/app/page.js',dest:'src/app/page.js'},
          {src:'src/app/customroutes/docs/',dest:'src/app/(defaultroutes)/docs/'},
          {src:'src/app/page.module.css',dest:'src/app/page.module.css'},
          {src:'src/app/components/Banner.jsx',dest:"src/app/components/Banner.jsx"},
          {src:'src/app/components/NavBar.jsx',dest:"src/app/components/NavBar.jsx"}
        ];
        
        const conditionalTemplates = [
          { 
            condition: this.oauth2,
            src:  "src/app/api/",
            dest: "src/app/api/"
          },
          {
            condition:apiServers,
            src:"src/app/customroutes/swagger/",
            dest:"src/app/(defaultroutes)/swagger/"
          },
          {
            condition:apiServers,
            src:"src/app/components/Swagger.jsx",
            dest:"src/app/components/Swagger.jsx"
          },
          {
            condition:servicesWithDB,
            src:"src/app/customroutes/notes/",
            dest:"src/app/(defaultroutes)/notes/"
          },
          {
            condition:servicesWithDB,
            src:"src/app/components/Notes.jsx",
            dest:"src/app/components/Notes.jsx"
          },
          {
            condition:servicesWithDB,
            src:"src/app/components/Modal.jsx",
            dest:"src/app/components/Modal.jsx"
          },
          {
            condition:servicesWithOutDB,
            src:"src/app/customroutes/ping/",
            dest:"src/app/(defaultroutes)/ping/"
          },
          {
            condition:servicesWithOutDB,
            src:"src/app/components/Ping.jsx",
            dest:"src/app/components/Ping.jsx"
          },
          {
            condition:this.oauth2,
            src:'src/app/providers/',
            dest:'src/app/providers/'
          },
          {
            condition:this.oauth2,
            src:'src/app/providers/',
            dest:'src/app/providers/'
          },
          {
            condition:this.oauth2,
            src:'src/app/customroutes/layout.js',
            dest:'src/app/(defaultroutes)/layout.js'
          },
          {
            condition:this.oauth2,
            src:'src/app/components/PrivateRoute.jsx',
            dest:'src/app/components/PrivateRoute.jsx'
          },
          { 
            condition: this.oauth2,
            src:  "docker/",
            dest: "docker/"
          },
        ];

        templatePaths.forEach(({ src, dest }) => {
          this.fs.copyTpl(
            this.templatePath(src),
            this.destinationPath(dest),
            templateVariables
          );
        });

        conditionalTemplates.forEach(({condition,src,dest})=>{
          const isArray = Array.isArray(condition);
          if((isArray&&condition.length>0)||(!isArray&&condition)){
            this.fs.copyTpl(
              this.templatePath(src),
              this.destinationPath(dest),
              templateVariables
            );
          }
        })
      }
    };
  }
}

