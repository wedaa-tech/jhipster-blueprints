package migrate

import (
 app "<%= packageName %>/config/loader"
 "database/sql"
 "strings"

 "github.com/golang-migrate/migrate/v4"
 _ "github.com/golang-migrate/migrate/v4/database/postgres"
 _ "github.com/golang-migrate/migrate/v4/source/file"
 _ "github.com/lib/pq"
 "github.com/micro/micro/v3/service/logger"
)

func generateUrl(databaseUrl, defaultDatabaseName, newDatabaseName string) string {
	return func() string {
		if lastIndex := strings.LastIndex(databaseUrl, defaultDatabaseName); lastIndex != -1 {
			return databaseUrl[:lastIndex] + newDatabaseName + databaseUrl[lastIndex+len(defaultDatabaseName):]
		}
		return databaseUrl
	}()
}

func MigrateAndCreateDatabase() {
	dsn := app.GetVal("GO_MICRO_DB_URL") + "?sslmode=disable"
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		logger.Errorf(err.Error())
	}
	defer db.Close()
	migrator, err := migrate.New(
		"file://migrate/migration",
		dsn)
	if err != nil {
		logger.Errorf(err.Error())
	}
	err = migrator.Up()
	if err != nil {
		logger.Errorf(err.Error())
	} else {
		versions, _, _ := migrator.Version()
		logger.Infof("Applied migration version: %d\n", versions)
	}
}
