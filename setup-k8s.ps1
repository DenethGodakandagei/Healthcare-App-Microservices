# Build all Docker images
docker build -t api-gateway:latest ./api-gateway
docker build -t frontend:latest ./frontend
docker build -t identity-service:latest ./services/identity-service
docker build -t patient-service:latest ./services/patient-service
docker build -t ai-symptom-service:latest ./services/ai-symptom-service
docker build -t appointment-service:latest ./services/appointment-service
docker build -t doctor-service:latest ./services/doctor-service
docker build -t notification-service:latest ./services/notification-service
docker build -t payment-service:latest ./services/payment-service
docker build -t telemedicine-service:latest ./services/telemedicine-service

# Apply all Kubernetes manifests
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/identity-service.yaml
kubectl apply -f k8s/patient-service.yaml
kubectl apply -f k8s/doctor-service.yaml
kubectl apply -f k8s/appointment-service.yaml
kubectl apply -f k8s/notification-service.yaml
kubectl apply -f k8s/payment-service.yaml
kubectl apply -f k8s/telemedicine-service.yaml
kubectl apply -f k8s/ai-symptom-service.yaml
kubectl apply -f k8s/ingress.yaml
