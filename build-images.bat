@echo off
echo Building DocVault DMS Docker Images for Kubernetes...
echo ==================================================

REM Build Auth Service
echo.
echo Building Auth Service...
cd services\auth
call mvnw.cmd clean package -DskipTests
docker build -t dms-auth:latest .
echo Auth Service built successfully
cd ..\..

REM Build Documents Service
echo.
echo Building Documents Service...
cd services\documents
call mvnw.cmd clean package -DskipTests
docker build -t dms-documents:latest .
echo Documents Service built successfully
cd ..\..

REM Build Comments Service
echo.
echo Building Comments Service...
cd services\comments
call mvnw.cmd clean package -DskipTests
docker build -t dms-comments:latest .
echo Comments Service built successfully
cd ..\..

REM Build Gateway
echo.
echo Building Gateway...
cd services\gateway
call mvnw.cmd clean package -DskipTests
docker build -t dms-gateway:latest .
echo Gateway built successfully
cd ..\..

REM Build Translator Service (if exists)
if exist "services\translator" (
    echo.
    echo Building Translator Service...
    cd services\translator
    docker build -t dms-translator:latest .
    echo Translator Service built successfully
    cd ..\..
)

REM Build Translation Consumer (if exists)
if exist "services\translation-consumer" (
    echo.
    echo Building Translation Consumer...
    cd services\translation-consumer
    docker build -t dms-translation-consumer:latest .
    echo Translation Consumer built successfully
    cd ..\..
)

REM Build Frontend
echo.
echo Building Frontend...
cd frontend
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)
call npm run build
docker build -t dms-ui:latest .
echo Frontend built successfully
cd ..

echo.
echo ==================================================
echo All images built successfully!
echo.
echo Built images:
docker images | findstr "dms-"

echo.
echo Next steps:
echo 1. For Minikube: minikube image load ^<image-name^>
echo 2. For K8s: kubectl apply -f infra/k8s/
echo 3. For Docker Compose: docker-compose -f infra/docker/docker-compose.full.yml up -d

pause
