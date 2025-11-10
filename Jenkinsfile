pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'rachintha'
        DOCKER_HUB_PASSWORD = credentials('dockerhub') // Use the Jenkins credentials ID
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
                sh "docker build -t $DOCKER_HUB_USERNAME/$BACKEND_IMAGE:latest ./taskmanger/backend"
                sh "docker build -t $DOCKER_HUB_USERNAME/$FRONTEND_IMAGE:latest ./taskmanger/frontend"
            }
        }

        stage('Push Docker Images') {
            steps {
                sh "echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin"
                sh "docker push $DOCKER_HUB_USERNAME/$BACKEND_IMAGE:latest"
                sh "docker push $DOCKER_HUB_USERNAME/$FRONTEND_IMAGE:latest"
            }
        }

        stage('Run Docker Containers') {
            steps {
                sh "docker rm -f $BACKEND_IMAGE || true"
                sh "docker rm -f $FRONTEND_IMAGE || true"
                sh "docker run -d --name $BACKEND_IMAGE -p 8080:8080 $DOCKER_HUB_USERNAME/$BACKEND_IMAGE:latest"
                sh "docker run -d --name $FRONTEND_IMAGE -p 5173:5173 $DOCKER_HUB_USERNAME/$FRONTEND_IMAGE:latest"
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
