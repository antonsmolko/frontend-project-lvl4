install: install-deps

start:
	heroku local -f Procfile.dev

start-backend:
	npx nodemon bin/slack.js

start-frontend:
	cd client; npm run start

install-deps:
	npm ci

build:
	npm run build

lint:
	npx eslint . --ext js,jsx

lint-fix:
	npx eslint ./client --ext js,jsx --fix

publish:
	npm publish

deploy:
	git push heroku

test:
	npm test -s

.PHONY: test
