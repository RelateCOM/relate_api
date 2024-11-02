all:
	docker-compose up -d

clean:
	docker system prune