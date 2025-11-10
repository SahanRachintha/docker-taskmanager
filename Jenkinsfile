pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'taskmanger-backend'
        FRONTEND_IMAGE = 'taskmanger-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/SahanRachintha/docker-taskmanager.git'
            }
        }

        stage('Build Backend') {
            steps {
                sh 'cd taskmanger/backend && mvn clean package -DskipTests'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'cd taskmanger/frontend && npm install && npm run build'
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    // Use Jenkins credentials securely
                    withCredentials([usernamePassword(credentialsId: 'dockerhub',
                                                      usernameVariable: 'DOCKER_HUB_USERNAME',
                                                      passwordVariable: 'DOCKER_HUB_PASSWORD')]) {

                        sh 'docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD'

                        sh "docker build -t $DOCKER_HUB_USERNAME/$BACKEND_IMAGE:latest ./taskmanger/backend"
                        sh "docker build -t $DOCKER_HUB_USERNAME/$FRONTEND_IMAGE:latest ./taskmanger/frontend"

                        sh "docker push $DOCKER_HUB_USERNAME/$BACKEND_IMAGE:latest"
                        sh "docker push $DOCKER_HUB_USERNAME/$FRONTEND_IMAGE:latest"
                    }
                }
            }
        }

        stage('Run Docker Containers') {
            steps {
                sh "docker rm -f taskmanger-backend || true"
                sh "docker rm -f taskmanger-frontend || true"
                sh "docker run -d --name taskmanger-backend -p 8080:8080 rachintha/taskmanger-backend:latest"
                sh "docker run -d --name taskmanger-frontend -p 5173:5173 rachintha/taskmanger-frontend:latest"
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
