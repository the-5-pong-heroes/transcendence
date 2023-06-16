include ./env/docker.example.env
export $(sed 's/=.*//' ./env/docker.example.env)

DOCKER_ENV_FILE		= ./env/docker.example.env

ifneq ($(shell docker compose version 2>/dev/null),)
  DOCKER_COMPOSE	= docker compose --env-file ${DOCKER_ENV_FILE}
else
  DOCKER_COMPOSE	= docker-compose --env-file ${DOCKER_ENV_FILE}
endif

DATABASE_VOLUME		= $(shell basename '$(CURDIR)_postgresql_data' | tr '[:upper:]' '[:lower:]')

RM					= rm -rf

SUDO 				= @sudo

all: run

check-env:
	@ if [ "${DOCKER_COMPOSE}" = "docker-compose" ]; then \
		echo "$(RED)⚠ Warning: you're using a old version of docker compose, please upgrade to v2.17 or above.$(END)"; \
		sleep 1; \
	fi

run: check-env
	$(DOCKER_COMPOSE) up --build --remove-orphans --force-recreate

list:
	${SUDO} docker container ps -a
	${SUDO} docker images
	${SUDO} docker volume ls

stop:
	${SUDO} $(DOCKER_COMPOSE) stop

down:
	${SUDO} $(DOCKER_COMPOSE) down

clean:  down
	${SUDO} docker container prune --force

fclean: clean
	${SUDO} docker system prune --all --force
	${SUDO} docker volume rm $(DATABASE_VOLUME)
	@printf "$(UP)"

re: fclean all

.PHONY: run up debug list list_volumes clean

RESET		= \033[0m
RED			= \033[1;31m
GREEN		= \033[1;32m
YELLOW		= \033[1;33m
BLUE		= \033[1;34m
WHITE		= \033[1;37m
ORANGE		= \033[0;38;5;208m
UP			= \033[A
CUT			= \033[K
