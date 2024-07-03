# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: egualand <egualand@student.42firenze.it    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/06/30 18:18:58 by egualand          #+#    #+#              #
#    Updated: 2024/06/30 18:23:43 by egualand         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:20.15.0

RUN npm install -g eas-cli expo-cli
RUN apt-get update && apt-get install -y git curl

COPY ./app /app
WORKDIR /app
RUN mkdir -p dist

RUN yarn install

# required by eas-cli
RUN git init && \
    git config --global user.email "jammy@docker.file" && \
    git config --global user.name "Jammy Dockerfile"

ARG EXPO_TOKEN
ENV EXPO_TOKEN=$EXPO_TOKEN

CMD ["sh", "-c", "eas build --non-interactive --platform android --profile production > /app/dist/build_result.txt"]