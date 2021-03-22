mongodb:
	docker-compose -p tpass -f app/docker-compose.yml up -d

runfastapi:
	uvicorn main:app --app-dir app/backend --reload

runreact:
	yarn --cwd app/frontend start

# https://www.serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/
aws-credentials:
	serverless config credentials --provider aws --profile localstack

serverless:
	serverless deploy --stage local
