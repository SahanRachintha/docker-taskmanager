pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'rachintha'
        BACKEND_IMAGE = 'taskmanger-backend'
        FRONTEND_IMAGE = 'taskmanger-frontend'
        EC2_USER = 'ubuntu'
        EC2_HOST = '3.238.255.79'   // 👈 replace if IP changes
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
                sh "docker build -t $DOCKER_HUB_USERNAME/$BACKEND_IMAGE:latest -f taskmanger/backend/auth/Dockerfile ./taskmanger/backend/auth"
                sh "docker build -t $DOCKER_HUB_USERNAME/$FRONTEND_IMAGE:latest ./taskmanger/frontend"
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push \$DOCKER_USER/$BACKEND_IMAGE:latest"
                    sh "docker push \$DOCKER_USER/$FRONTEND_IMAGE:latest"
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(['aws-ec2-ssh']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '

                      docker network create taskmanager-network || true

                      docker rm -f mongo || true
                      docker rm -f taskmanger-backend || true
                      docker rm -f taskmanger-frontend || true

                      docker pull rachintha/taskmanger-backend:latest
                      docker pull rachintha/taskmanger-frontend:latest

                      docker run -d \
                        --name mongo \
                        --network taskmanager-network \
                        -p 27017:27017 \
                        -e MONGO_INITDB_DATABASE=authdb \
                        mongo:6.0

                      docker run -d \
                        --name taskmanger-backend \
                        --network taskmanager-network \
                        -p 8081:8080 \
                        rachintha/taskmanger-backend:latest

                      docker run -d \
                        --name taskmanger-frontend \
                        --network taskmanager-network \
                        -p 5174:5173 \
                        -e REACT_APP_BACKEND_URL=http://taskmanger-backend:8080 \
                        rachintha/taskmanger-frontend:latest
                    '
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

