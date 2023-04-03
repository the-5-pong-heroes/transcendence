
BLACK		:= $(shell tput -Txterm setaf 0)
RED			:= $(shell tput -Txterm setaf 1)
GREEN		:= $(shell tput -Txterm setaf 2)
YELLOW		:= $(shell tput -Txterm setaf 3)
LIGHTPURPLE	:= $(shell tput -Txterm setaf 4)
PURPLE		:= $(shell tput -Txterm setaf 5)
BLUE		:= $(shell tput -Txterm setaf 6)
WHITE		:= $(shell tput -Txterm setaf 7)
RESET		:= $(shell tput -Txterm sgr0)

include ./env/docker.example.env
export $(shell sed 's/=.*//' ./env/docker.example.env)

# DIR_CHECK := $(shell grep POSTGRES_DIR example.env > /dev/null; echo $$?)

all: run

run:
	docker-compose up --build --remove-orphans --force-recreate
# ifeq ($(DIR_CHECK), 1)
# 	@read -p "Enter Postgres path: " POSTGRES_DIR; \
# 	sudo mkdir -p $$POSTGRES_DIR; \
# 	echo "POSTGRES_DIR=$$POSTGRES_DIR" >> example.env
# endif
# 	@cp example.env .env
# 	@sudo docker-compose up -d

list:
	@sudo docker container ps -a ; sudo docker images

# clean:
# ifeq ($(DIR_CHECK), 0)
# 	@sed -i "$$(grep -n POSTGRES_DIR example.env | cut -f1 -d:)d" example.env
# 	@echo POSTGRES_DIR var removed from example.env
# endif
# 	@sudo docker-compose down
# 	@sudo docker container prune --force
# 	sudo rm -rf $${POSTGRES_DIR}

fclean: clean
	-sudo docker stop `sudo docker ps -qa`
	-sudo docker rm `sudo docker ps -qa`
	-sudo docker rmi -f `sudo docker images -qa`
	-sudo docker volume rm `sudo docker volume ls -q`
	-sudo docker network rm `sudo docker network ls -q 2>/dev/null`
	sudo rm .env
	sudo rm -rf $${POSTGRES_DIR}

re: fclean run

.PHONY: run up debug list list_volumes clean
