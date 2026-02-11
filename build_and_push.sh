#!/bin/bash
set -e  # зупиняє скрипт при помилці

cd my-transfer-ts
docker build -t transfer-react --build-arg VITE_API_BASE_URL=http://3.77.200.46:5898 .
docker tag transfer-react:latest maxslipchuk22/transfer-react:latest
docker push maxslipchuk22/transfer-react:latest
echo "Done ---client---!"

cd ../WebApiTransfer
docker build -t transfer-api .
docker tag transfer-api:latest maxslipchuk22/transfer-api:latest
docker push maxslipchuk22/transfer-api:latest

echo "Done ---api---!"

read -p "Press any key to exit..."
