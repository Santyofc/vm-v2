#!/bin/bash
set -o pipefail
CONTAINER_NAME="citas_db_prod"
BACKUP_PATH="/deployments/zonasur_v1/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
DATABASE_NAME="zonasur_db" 
DB_USER="postgres"
RETENTION_DAYS=7

mkdir -p $BACKUP_PATH
docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DATABASE_NAME | gzip > "$BACKUP_PATH/db_backup_$TIMESTAMP.sql.gz"

if [ $? -eq 0 ]; then
  echo "Backup successful: db_backup_$TIMESTAMP.sql.gz"
  find $BACKUP_PATH -type f -name "*.sql.gz" -mtime +$RETENTION_DAYS -exec rm {} \;
else
  echo "ERROR: Backup failed."
  rm -f "$BACKUP_PATH/db_backup_$TIMESTAMP.sql.gz"
  exit 1
fi
