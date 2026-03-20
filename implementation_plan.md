# Project Setup and File Structure Plan

This plan outlines the architecture and directory structure for the robust, cloud-native Healthcare Appointment & Telemedicine Platform using Microservices, Node.js/Express.js, React Vite, Docker, and Kubernetes.

## User Review Required
> [!IMPORTANT]
> Please review the chosen technology stack and folder structure below. By default, I am proposing Node.js/Express for the backend services and React (Vite) for the frontend. Let me know if you would like to change this to a different stack (e.g., Spring Boot, Python, Angular). 

## High-Level Architecture & Setup Steps

1. **Initialize Root Structure**: Setup base project configuration, `.gitignore`, and overarching `docker-compose.yml` for local orchestration.
2. **Setup Kubernetes Directory (`k8s/`)**: Structure for manifests (Deployments, Services, ConfigMaps, Ingress).
3. **Setup Frontend (`frontend/`)**: Initialize a React Vite application.
4. **Setup Microservices (`services/`)**: Initialize each backend service within its dedicated directory.
5. **Setup API Gateway (`api-gateway/`)**: A dedicated entry point to route client requests to appropriate underlying microservices.

## Proposed File Structure

```text
c:/Users/Acer/OneDrive/Documents/Healthcare-App-Microservices/
├── api-gateway/                 # Central entry point routing requests to services
│   ├── src/
│   │   ├── middlewares/         # Global auth, rate-limiting, logging
│   │   ├── routes/              # Proxy routing definitions
│   │   └── server.js            # Express Gateway Entry Point
│   ├── Dockerfile
│   └── package.json
├── frontend/                    # React (Vite) Asynchronous Web Client
│   ├── src/
│   │   ├── assets/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components (PatientDashboard, Booking, etc.)
│   │   ├── services/            # API integration (Axios calls)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── context/             # State management (e.g. AuthContext)
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── k8s/                         # Kubernetes Configuration Manifests
│   ├── ingress.yaml
│   ├── patient-service.yaml
│   ├── doctor-service.yaml
│   └── ... (other manifests)
├── services/                    # All individual backend microservices
│   ├── patient-service/         # Patient management (Register, profile, reports)
│   ├── doctor-service/          # Doctor management (Profile, schedule, prescriptions)
│   ├── appointment-service/     # Appointments (Booking, scaling, real-time status)
│   ├── telemedicine-service/    # Video integration (Agora/Twilio/Jitsi)
│   ├── payment-service/         # Payments (Stripe/PayHere)
│   ├── notification-service/    # SMS/Email (Twilio/SendGrid/Nodemailer)
│   └── ai-symptom-service/      # AI models for preliminary checks
│
├── docker-compose.yml           # Local dev orchestration encompassing all services
├── README.md                    # Deployment and run documentation
└── .gitignore
```

### Clean Architecture strictly followed inside each Microservice (e.g., `services/patient-service/`)

```text
patient-service/
├── src/
│   ├── config/          # Environment vars, DB connections
│   ├── controllers/     # Handling incoming HTTP requests & responding
│   ├── models/          # Database schemas (Mongoose / Sequelize)
│   ├── routes/          # API route definitions
│   ├── services/        # Core business logic isolating from controllers
│   ├── middlewares/     # Service-specific middleware (auth checks, error handling)
│   ├── utils/           # Helper functions (logging, formatting)
│   └── server.js        # Main microservice entry point
├── tests/               # Unit and Integration tests
├── .env.example         # Example environment variables
├── Dockerfile           # Blueprint for this specific microservice image
└── package.json         # Node.js dependencies
```

## Verification Plan
1. Ensure all `package.json` initialization steps succeed without errors.
2. Ensure Dockerfiles are correctly structured with base node images.
3. Validate base directory creation with Node.js and React Vite CLI tools.
