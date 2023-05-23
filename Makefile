RED=\033[0;31m
END=\033[0m

include ./env/docker.example.env
export $(shell sed 's/=.*//' ./env/docker.example.env)

ifneq ($(shell docker compose version 2>/dev/null),)
  DOCKER_COMPOSE=docker compose
else
  DOCKER_COMPOSE=docker-compose
endif

all: run

check-env:
	@ if [ "${DOCKER_COMPOSE}" = "docker-compose" ]; then \
		echo "$(RED)⚠ Warning: you're using a old version of docker compose, please upgrade to v2.17 or above.$(END)"; \
		sleep 1; \
	fi

run: check-env
	$(DOCKER_COMPOSE) up --build --remove-orphans --force-recreate

list:
	@sudo docker container ps -a ; sudo docker images

clean:
	@sudo $(DOCKER_COMPOSE) down
	@sudo docker container prune --force

fclean:
	-sudo docker stop `sudo docker ps -qa`
	-sudo docker rm `sudo docker ps -qa`
	-sudo docker rmi -f `sudo docker images -qa`
	-sudo docker volume rm `sudo docker volume ls -q`
	-sudo docker network rm `sudo docker network ls -q 2>/dev/null`
	sudo rm .env

re: fclean run

.PHONY: run up debug list list_volumes clean
