workspace "ClinicTrack" "Sistema fullstack para acompanhamento clínico de pacientes com processamento assíncrono e integração com IA" {

    model {
        usr = person "Usuário" "Médico ou profissional de saúde que utiliza o sistema"

        gemini = softwareSystem "Gemini API" "API de IA generativa do Google para gerar resumos automáticos" {
            tags "external"
        }

        clinicTrack = softwareSystem "ClinicTrack" "Sistema de acompanhamento clínico de pacientes" {

            frontend = container "Frontend" "React 19, Vite 8, TypeScript, MUI v9" "Aplicação web SPA para interface do usuário"

            backend = container "Backend" "Java 21, Spring Boot 3.5, Maven, Flyway" "API REST com processamento assíncrono e integração com IA" {

                patientCtrl = component "PatientController" "REST Controller" "Endpoints para CRUD de pacientes"
                evolutionCtrl = component "ClinicalEvolutionController" "REST Controller" "Endpoints para evoluções clínicas"
                notificationCtrl = component "NotificationController" "REST Controller" "Endpoints para notificações"

                patientSvc = component "PatientService" "Service" "Regras de negócio para pacientes"
                evolutionSvc = component "ClinicalEvolutionService" "Service" "Regras de negócio para evoluções clínicas"
                notificationSvc = component "NotificationService" "Service" "Criação de notificações"
                geminiSvc = component "GeminiService" "Service" "Integração com Gemini API via RestClient"

                patientRepo = component "PatientRepository" "Repository" "Acesso a dados da tabela patients"
                evolutionRepo = component "ClinicalEvolutionRepository" "Repository" "Acesso a dados da tabela clinical_evolutions"
                notificationRepo = component "NotificationRepository" "Repository" "Acesso a dados da tabela notifications"

                evolutionEvent = component "NewClinicalEvolutionEvent" "Event" "Evento disparado após criar evolução clínica"
                evolutionListener = component "ClinicalEvolutionEventListener" "Listener" "Processa evento assincronamente com @Async"
            }

            database = container "Database" "PostgreSQL 16" "Banco de dados relacional" {
                tags "database"
            }
        }

        usr -> frontend "Acessa via navegador" "HTTPS"
        frontend -> backend "Requisições REST" "HTTPS"
        backend -> database "Conexão JDBC" "TCP/5432"
        backend -> gemini "Geração de resumo" "HTTPS"

        patientCtrl -> patientSvc "Delega operações"
        evolutionCtrl -> evolutionSvc "Delega operações"
        notificationCtrl -> notificationSvc "Delega operações"

        patientSvc -> patientRepo "Persiste e consulta"
        evolutionSvc -> evolutionRepo "Persiste e consulta"
        notificationSvc -> notificationRepo "Persiste e consulta"

        evolutionSvc -> evolutionEvent "Publica NewClinicalEvolutionEvent"
        evolutionEvent -> evolutionListener "Dispara evento assíncrono"
        evolutionListener -> geminiSvc "Solicita resumo"
        evolutionListener -> notificationSvc "Cria notificação"
        geminiSvc -> gemini "HTTP POST"
        geminiSvc -> evolutionRepo "Atualiza evolução com resumo"
    }

    views {
        systemcontext clinicTrack "SystemContext" "Diagrama de Contexto - ClinicTrack" {
            include *
            autolayout lr
        }

        container clinicTrack "Container" "Diagrama de Containers - ClinicTrack" {
            include *
            autolayout lr
        }

        component backend "BackendComponents" "Diagrama de Componentes - Backend" {
            include *
            autolayout lr
        }

        dynamic backend "EvolutionFlow" "Fluxo de criacao de evolucao clinica" {
            evolutionCtrl -> evolutionSvc "POST /api/patients/{id}/evolutions"
            evolutionSvc -> evolutionEvent "publica NewClinicalEvolutionEvent"
            evolutionEvent -> evolutionListener "@EventListener"
            evolutionListener -> geminiSvc "geminiService.generateSummary()"
            geminiSvc -> gemini "HTTP POST"
            geminiSvc -> evolutionRepo "update(geminiSummary)"
            evolutionListener -> notificationSvc "notificationService.create()"
            notificationSvc -> notificationRepo "save(notification)"
            autolayout tb
        }

        styles {
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }
            element "SoftwareSystem" {
                background #1168bd
                color #ffffff
            }
            element "Container" {
                background #438dd5
                color #ffffff
            }
            element "Component" {
                background #85bbf0
                color #000000
            }
            element "database" {
                shape cylinder
                background #438dd5
                color #ffffff
            }
            element "external" {
                background #999999
                color #ffffff
                shape roundedbox
            }
        }
    }
}
