# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: egualand <egualand@student.42firenze.it    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/06/29 10:07:44 by craimond          #+#    #+#              #
#    Updated: 2024/06/30 18:14:43 by egualand         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

DOCKER_COMPOSE_PATH = docker-compose.yml
DIST_DIR = ./app/dist

all: init build up

init:
	mkdir -p $(DIST_DIR)
	chmod 777 $(DIST_DIR)

build:
	docker-compose -f $(DOCKER_COMPOSE_PATH) build

build-no-cache:
	docker-compose -f $(DOCKER_COMPOSE_PATH) build --no-cache

up:
	docker-compose -f $(DOCKER_COMPOSE_PATH) up

down:
	docker-compose -f $(DOCKER_COMPOSE_PATH) down

restart:
	docker-compose -f $(DOCKER_COMPOSE_PATH) restart

logs:
	docker-compose -f $(DOCKER_COMPOSE_PATH) logs

fclean: down
	docker system prune --all --force --volumes
	rm -rf $(DIST_DIR)

re: fclean all

.PHONY: all init build up down restart logs fclean re