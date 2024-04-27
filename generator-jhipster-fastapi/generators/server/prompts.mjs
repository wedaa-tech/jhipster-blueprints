import _ from 'lodash';

export async function askForServerSideOpts() {
    if (this.options.fromJdl){ 
        this.serverPort=this.jhipsterConfigWithDefaults.serverPort;
        this.packageName=this.jhipsterConfigWithDefaults.packageName;
        this.baseName=this.jhipsterConfigWithDefaults.baseName;
        this.auth=(this.jhipsterConfigWithDefaults.authenticationType=="oauth2")
        this.eureka=(this.jhipsterConfigWithDefaults.serviceDiscoveryType=="eureka")
        this.rabbitmq=(this.jhipsterConfigWithDefaults.messageBroker=="rabbitmq")
        this.postgress=(this.jhipsterConfigWithDefaults.prodDatabaseType=="postgresql")
        this.mongodb=(this.jhipsterConfigWithDefaults.databaseType=="mongodb")
        this.databasePort=this.jhipsterConfigWithDefaults.databasePort;
      return ;
    }
}