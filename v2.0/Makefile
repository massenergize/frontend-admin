init:
	npm install
	npm run build:dll
.PHONY: init

start:
	npm start
.PHONY: start

build:
	npm run build
.PHONY: build

deploy-prod:
	npm run build && aws2 s3 sync build/ s3://admin.massenergize.org
.PHONY: deploy-prod

deploy-dev:
	npm run build && aws2 s3 sync build/ s3://admin-dev.massenergize.org
.PHONY: deploy-dev
