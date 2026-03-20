# Healthcare Appointment & Telemedicine Platform

A cloud-native healthcare platform similar to real-world telemedicine systems. 
Built using a Microservices architecture with Node.js/Express backends, React 
(Vite) frontend, Docker, and Kubernetes.

## Services
1. **API Gateway**: Single entry point (`api-gateway/`)
2. **Patient Service**: Patient management (`services/patient-service/`)
3. **Doctor Service**: Doctor management (`services/doctor-service/`)
4. **Appointment Service**: Bookings (`services/appointment-service/`)
5. **Telemedicine Service**: Video consultation (`services/telemedicine-service/`)
6. **Payment Service**: Integrations with payment gateways (`services/payment-service/`)
7. **Notification Service**: Emails/SMS (`services/notification-service/`)
8. **Frontend Website**: React Web/Mobile Interface (`frontend/`)

## How to Run Locally

### Docker Compose
Run the entire architecture locally via docker-compose:
```bash
docker-compose up --build
```
