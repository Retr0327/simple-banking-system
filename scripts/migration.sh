#!/bin/bash

DOCKER_COMPOSE_FILE=""
MIGRATE_ACTION=""
MIGRATION_NAME=""

while getopts "f:a:n:" flag; do
    case "${flag}" in
        a) MIGRATE_ACTION=${OPTARG};;
        f) DOCKER_COMPOSE_FILE=${OPTARG};;
        n) MIGRATION_NAME=${OPTARG};;
        \?) echo "Invalid option: -$OPTARG" >&2; exit 1;;
        :) echo "Option -$OPTARG requires an argument." >&2; exit 1;;
    esac
done

if [ -z "$DOCKER_COMPOSE_FILE" ] || [ -z "$MIGRATE_ACTION" ]; then
    echo "Error: Both -f (docker compose file path) and -a (action) options are required." >&2
    echo "Usage: $0 -f <docker_compose_file_path> -s <docker_service_namespace> -a <migrate_action> [-n <migration_name>]" >&2
    exit 1
fi

# Additional condition for when MIGRATE_ACTION is 'generate'
if [ "$MIGRATE_ACTION" = "generate" ] && [ -z "$MIGRATION_NAME" ]; then
    echo "Error: Option -n (migration name) is required when -a is 'generate'." >&2
    echo "Usage: $0 -f <docker_compose_file_path> -a generate -n <migration_name>" >&2
    exit 1
fi

BASE_DIR=$(realpath $0)
for i in {1..2}; do
    BASE_DIR=$(dirname $BASE_DIR)
done

ENV_EXPORTS="export MYSQL_HOST=\$(dig +short mysql)"

if [ "$MIGRATE_ACTION" == "generate" ]; then 
    docker compose -f $DOCKER_COMPOSE_FILE exec api /bin/bash -c "$ENV_EXPORTS && pnpm run typeorm migration:$MIGRATE_ACTION ./typeorm/migrations/$MIGRATION_NAME"
elif [ "$MIGRATE_ACTION" == "run" ]; then
    docker compose -f $DOCKER_COMPOSE_FILE exec api /bin/bash -c "$ENV_EXPORTS && pnpm run typeorm migration:$MIGRATE_ACTION"
else
    echo "Invalid action specified. Please use 'establish' or 'reset'."
    exit 1
fi