FROM nginx:1.25.5

RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get install -y \
	bash \
	iproute2 \
	netcat-traditional \
	&& rm -rf /var/lib/apt/lists/*
COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]