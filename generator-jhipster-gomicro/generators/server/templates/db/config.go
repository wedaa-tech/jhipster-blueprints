package config

import (
	app "<%= packageName %>/config"

	"github.com/micro/micro/v3/service/logger"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func GetClient() *gorm.DB {
	db_url := app.GetVal("GO_MICRO_DB_URL")
	db, err := gorm.Open(postgres.Open(db_url), &gorm.Config{})
	if err != nil {
		logger.Errorf("failed to connect database")
		return nil
	}
	return db
}
