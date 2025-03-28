#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status
# set -x  # Print commands and their arguments as they are executed

AWS_ACCOUNT="471112780680"
AWS_DEFAULT_REGION="sa-east-1"
REPOSITORY_NAME="denguechatplus-web-develop"
TAG="latest"
CONTAINER_NAME="denguechatplus"
PORT=${1:-8000}
IMAGE_NAME="$AWS_ACCOUNT.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REPOSITORY_NAME:$TAG"

function check_prerequisites() {
    command -v docker >/dev/null 2>&1 || { echo >&2 "Docker is required but it's not installed. Aborting."; exit 1; }
    command -v aws >/dev/null 2>&1 || { echo >&2 "AWS CLI is required but it's not installed. Aborting."; exit 1; }
}

function log_message() {
    echo "$(date): $1"
}

function stop_and_remove_container() {
    docker stop $CONTAINER_NAME || echo "No container named $CONTAINER_NAME found to stop"
    docker container rm $CONTAINER_NAME || echo "No container named $CONTAINER_NAME found to delete"
}

function login_to_ecr() {
    aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
}

function pull_and_run_image() {
    docker pull $IMAGE_NAME
    docker run -d -p $PORT:80 --name $CONTAINER_NAME $IMAGE_NAME
}

function clean_unused_images() {
    docker images --format "{{.Repository}}:{{.Tag}} {{.CreatedAt}}" | \
        grep -v "$IMAGE_NAME:$TAG" | \
        awk 'NR>3 {print $1}' | \
        xargs -I {} docker rmi {} || echo "No unused images found to remove"
    docker system prune -f --volumes
}



log_message "Script start"

check_prerequisites
stop_and_remove_container
login_to_ecr
pull_and_run_image
clean_unused_images

log_message "Script end"
