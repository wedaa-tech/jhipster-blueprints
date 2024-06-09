

export async function loadReactGeneratorOpts() {

  if (this.options.fromJdl){ 
      this.serverPort=this.jhipsterConfigWithDefaults.serverPort;
      this.packageName=this.jhipsterConfigWithDefaults.packageName;
      this.baseName=this.jhipsterConfigWithDefaults.baseName;
      this.oauth2=(this.jhipsterConfigWithDefaults.authenticationType=="oauth2")
      this.eureka=(this.jhipsterConfigWithDefaults.serviceDiscoveryType=="eureka")
      this.rabbitmq=(this.jhipsterConfigWithDefaults.messageBroker=="rabbitmq")
      this.postgress=(this.jhipsterConfigWithDefaults.prodDatabaseType=="postgresql")
      this.mongodb=(this.jhipsterConfigWithDefaults.databaseType=="mongodb")
      this.nodePort=(this.jhipsterConfigWithDefaults.applicationIndex) + 30200 // app node port start's from 30200
    return ;
  }
}

