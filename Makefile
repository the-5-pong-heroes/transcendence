
BLACK		:= $(shell tput -Txterm setaf 0)
RED			:= $(shell tput -Txterm setaf 1)
GREEN		:= $(shell tput -Txterm setaf 2)
YELLOW		:= $(shell tput -Txterm setaf 3)
LIGHTPURPLE	:= $(shell tput -Txterm setaf 4)
PURPLE		:= $(shell tput -Txterm setaf 5)
BLUE		:= $(shell tput -Txterm setaf 6)
WHITE		:= $(shell tput -Txterm setaf 7)
RESET		:= $(shell tput -Txterm sgr0)

DIR_CHECK := $(shell grep POSTGRESQL_DIR .env > /dev/null; echo $$?)

all: run

run: 
ifeq ($(DIR_CHECK), 1)
	@read -p "Enter Postgres path: " POSTGRESQL_DIR; \
	sudo mkdir -p $$POSTGRESQL_DIR; \
	echo "POSTGRESQL_DIR=$$POSTGRESQL_DIR" >> .env
endif
	@sudo docker-compose up -d

list:	
	@sudo docker container ps -a ; sudo docker images

clean: 
ifeq ($(DIR_CHECK), 0)
	@sed -i "$$(grep -n POSTGRESQL_DIR .env | cut -f1 -d:)d" .env
	@echo POSTGRESQL_DIR var removed from .env
endif
	@sudo docker-compose down
	@sudo docker container prune --force
	sudo rm -rf $${POSTGRESQL_DIR}

fclean: clean
	-sudo docker stop `sudo docker ps -qa`
	-sudo docker rm `sudo docker ps -qa`
	-sudo docker rmi -f `sudo docker images -qa`
	-sudo docker volume rm `sudo docker volume ls -q`
	-sudo docker network rm `sudo docker network ls -q 2>/dev/null`
	sudo rm -rf $${POSTGRESQL_DIR}

re: fclean run

.PHONY: run up debug list list_volumes clean