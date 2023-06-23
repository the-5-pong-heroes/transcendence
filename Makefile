# updates the path to your environment file below (see the files .env.example)
DOCKER_ENV_FILE		= ./env/docker.env

ifneq ($(shell docker compose version 2>/dev/null),)
  DOCKER_COMPOSE	= docker compose --env-file ${DOCKER_ENV_FILE}
else
  DOCKER_COMPOSE	= docker-compose --env-file ${DOCKER_ENV_FILE}
endif

DATABASE_VOLUME		= $(shell basename '$(CURDIR)_postgresql_data' | tr '[:upper:]' '[:lower:]')

all: run

check-env:
	@ if [ "${DOCKER_COMPOSE}" = "docker-compose" ]; then \
		echo "$(RED)⚠ Warning: you're using a old version of docker compose, please upgrade to v2.17 or above.$(END)"; \
		sleep 1; \
	fi

run: check-env
	$(DOCKER_COMPOSE) up --build --remove-orphans --force-recreate

list:
	docker container ps -a
	docker images
	docker volume ls

stop:
	$(DOCKER_COMPOSE) stop

down:
	$(DOCKER_COMPOSE) down

clean:  down
	docker container prune --force

fclean: clean
	docker system prune --all --force
	docker volume rm $(DATABASE_VOLUME)
	@printf "$(UP)"

re: fclean all

.PHONY: run up debug list list_volumes clean

RESET		= \033[0m
RED			= \033[1;31m
GREEN		= \033[1;32m
YELLOW	= \033[1;33m
BLUE		= \033[1;34m
WHITE		= \033[1;37m
ORANGE	= \033[0;38;5;208m
UP			= \033[A
CUT			= \033[K
