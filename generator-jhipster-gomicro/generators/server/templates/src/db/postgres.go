package config

import (
	app "<%= packageName %>/config/loader"

	"github.com/micro/micro/v3/service/logger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DatabaseClient *gorm.DB

func InitializeDb() {
	DatabaseClient = GetClient()
	if DatabaseClient == nil {
		logger.Error("Database client is nil")
	}
}

func GetClient() *gorm.DB {
	db_url := app.GetVal("GO_MICRO_DB_URL")
	db, err := gorm.Open(postgres.Open(db_url), &gorm.Config{})
	if err != nil {
		logger.Errorf("failed to connect database")
		return nil
	}
	return db
}
