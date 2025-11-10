pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'rachintha'
        BACKEND_IMAGE = 'taskmanger-backend'
        FRONTEND_IMAGE = 'taskmanger-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/SahanRachintha/docker-taskmanager.git'
            }
        }

        stage('Prepare Backend') {
            steps {
                sh 'chmod +x taskmanger/backend/auth/mvnw'
            }
        }

        stage('Build Backend') {
            steps {
                sh 'cd taskmanger/backend/auth && ./mvnw clean package -DskipTests'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'cd taskmanger/frontend && npm install && npm run build'
            }
        }

        stage('Build Docker Images') {
            steps {
                // Build backend image using Dockerfile inside auth folder
                sh "docker build -t $DOCKER_HUB_USERNAME/$BACKEND_IMAGE:latest -f taskmanger/backend/auth/Dockerfile ./taskmanger/backend/auth"
                // Build frontend image
                sh "docker build -t $DOCKER_HUB_USERNAME/$FRONTEND_IMAGE:latest ./taskmanger/frontend"
            }
        }

        stage('Push Docker Images') {
            steps {
                // Secure login using credentials stored in Jenkins
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push \$DOCKER_USER/$BACKEND_IMAGE:latest"
                    sh "docker push \$DOCKER_USER/$FRONTEND_IMAGE:latest"
                }
            }
        }

        stage('Run Docker Containers') {
            steps {
                // Remove old containers if exist
                sh "docker rm -f $BACKEND_IMAGE || true"
                sh "docker rm -f $FRONTEND_IMAGE || true"
                // Run new containers
                sh "docker run -d --name $BACKEND_IMAGE -p 8080:8080 \$DOCKER_HUB_USERNAME/$BACKEND_IMAGE:latest"
                sh "docker run -d --name $FRONTEND_IMAGE -p 5173:5173 \$DOCKER_HUB_USERNAME/$FRONTEND_IMAGE:latest"
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
