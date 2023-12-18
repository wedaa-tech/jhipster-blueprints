import fs from 'fs';
import path from 'path';
import chalk from "chalk";


export function loadCommunicationConfigs() {
  const path = this.destinationPath('../' + this.jhipsterConfig.baseName);
  if (this.fs.exists(`${path}/comm.yo-rc.json`)) {
    try {
      let communications = JSON.parse(fs.readFileSync(`${path}/comm.yo-rc.json`));
      return communications;
    } catch (err) {
      throw new Error(`Cannot parse the file comm.yo-rc.json in '${this.directoryPath}'`);
    }
  }
}

export function loadAppConfigs() {
  const basePath = this.destinationPath('../');
  let appConfigs = [];
  const items = fs.readdirSync(basePath);
  const dirs = items.filter((item) => fs.statSync(path.join(basePath, item)).isDirectory());
  for (const dir of dirs) {
    if (this.fs.exists(`${basePath}/${dir}/.yo-rc.json`)) {
      try {
        const appConfig = JSON.parse(fs.readFileSync(`${basePath}/${dir}/.yo-rc.json`));
        appConfigs.push(appConfig);
      } catch (err) {
        throw new Error(`Cannot parse the file .yo-rc.json in '${basePath}/${dir}'`);
      }
    }
  }
  return appConfigs;
}

export function loadDeploymentConfigs() {
  const basePath = this.destinationPath('../');
  let deploymentConfig ;

  const items = fs.readdirSync(basePath);
  const dirs = items.filter((item) => fs.statSync(path.join(basePath, item)).isDirectory());
  for (const dir of dirs) {
    if (this.fs.exists(`${basePath}/${dir}/.yo-rc.json`) ) {
      try {
        const tempConfig = JSON.parse(fs.readFileSync(`${basePath}/${dir}/.yo-rc.json`));
        if(tempConfig['generator-jhipster'].deploymentType !== undefined) {
          deploymentConfig = tempConfig['generator-jhipster'];
          break;
        }
      } catch (err) {
        throw new Error(`Cannot parse the file .yo-rc.json in '${basePath}/${dir}'`);
      }
    }
  }
  return deploymentConfig;
}

export function deleteUnwantedFiles() {
  const generatedFilesDir = this.destinationPath();
  const generatedFiles = fs.readdirSync(generatedFilesDir);
  generatedFiles.forEach((file) => {
    if (file !== '.yo-rc.json' && file !== 'comm.yo-rc.json') {
      const filePath = path.join(generatedFilesDir, file);
      if (fs.existsSync(filePath)) {
        if (fs.statSync(filePath).isDirectory()) {
          fs.rmdirSync(filePath, { recursive: true });
        } else {
          fs.unlinkSync(filePath);
        }
        this.log(chalk.red(`  Deleted`) + `  ${this.destinationPath(filePath)}`);
      }
    }
  });
}

export function processApiServersforClinet() {
  let communications = loadCommunicationConfigs.call(this);
  let appConfigs = loadAppConfigs.call(this);
  let apiServers = [];

  appConfigs.forEach(appConfig => {
    const { baseName, serverPort } = appConfig['generator-jhipster'];
    const matchingCommunication = communications.find(comm => comm.server === baseName && comm.client === this.baseName);
    if (matchingCommunication) {
      let nodePort = appConfig['generator-jhipster'].applicationIndex  + 30200;  // app node port start's from 30200
      apiServers.push({ baseName, serverPort, nodePort });
    }
  });
  return apiServers;
}

export function loadServicesWithAndWithOutDB() {
  let communications = loadCommunicationConfigs.call(this);
  let appConfigs = loadAppConfigs.call(this);
  let servicesWithOutDB = [];
  let servicesWithDB = [];

  appConfigs.forEach(appConfig => {
    const { baseName, databaseType } = appConfig['generator-jhipster'];
    const matchingCommunication = communications.find(comm => comm.server === baseName && comm.client === this.baseName);
    if (matchingCommunication && databaseType === 'no') {
      servicesWithOutDB.push(baseName);
    } else if (matchingCommunication&& databaseType !== 'no'){
      servicesWithDB.push(baseName);
    }
  });
  return {servicesWithDB, servicesWithOutDB};
}