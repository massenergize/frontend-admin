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
	python deployment/prepare_to_deploy.py prod 0 1
	npm run build && aws2 s3 sync build/ s3://admin.massenergize.org
.PHONY: deploy-prod

deploy-dev:
	python deployment/prepare_to_deploy.py dev 0 1
	npm run build && aws2 s3 sync build/ s3://admin-dev.massenergize.org
.PHONY: deploy-dev

run-dev:
	python deployment/prepare_to_deploy.py dev  $(local)
	npm start
.PHONY: run-dev

run-prod:
	python deployment/prepare_to_deploy.py prod $(local)
	npm start
.PHONY: run-prod
