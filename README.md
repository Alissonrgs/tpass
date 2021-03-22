# Tpass

Sistema de geração e compartilhamento de senhas

## Funcionalidades

* Sistema gera senha aleatória baseada em políticas de complexidade, tamanho, tipo de caracteres, números, letras, símbolos.
* Usuário especifica quantas vezes a senha gerada poderá ser vista, qual o tempo que a senha ficará válida e caso necessite uma chave de acesso.
* O sistema gera uma URL única que dá acesso a visualização da senha, baseando-se nos critérios do item 02.
* Após atingir a quantidade de visualizações ou o tempo disponível, o sistema bloqueia a visualização da senha.

## Tecnologias

* backend
    - Python 3.8
    - FastAPI
    - Motor (MongoDB)
    - Mangum

* frontend
    - Typescript
    - React
    - Semantic UI
    - Styled Components

* infra dev
    - Docker
    - Serverless Framework
    - Localstack

## Executar

* backend

    ```
    make mongodb
    make runfastapi
    ```

* frontend

    ```
    make runreact
    ```

* infra dev

    Configura as credenciais de acesso AWS
    ```
    make aws-credentials
    ```

    Inicializa o docker do localstack
    ```
    docker-compose up -d
    ```

    Sobe a aplicação via serverless framework
    ```
    serverless deploy --stage local
    ```