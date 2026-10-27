pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
    }

    environment {
        IMAGE_NAME = 'classlab-web'
        CONTAINER_NAME = 'classlab-web'
        HOST_PORT = '8080'
        CONTAINER_PORT = '80'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    script {
                        env.FULL_IMAGE_NAME = "${DOCKERHUB_USER}/${env.IMAGE_NAME}"
                    }
                }
                script {
                    env.BUILD_IMAGE_TAG = "${env.FULL_IMAGE_NAME}:${env.BUILD_NUMBER}"
                    env.LATEST_IMAGE_TAG = "${env.FULL_IMAGE_NAME}:latest"
                }
                sh 'docker build --tag "$BUILD_IMAGE_TAG" --tag "$LATEST_IMAGE_TAG" .'
            }
        }

        stage('Push image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh '''
                        set +x
                        printf '%s' "$DOCKERHUB_TOKEN" | docker login --username "$DOCKERHUB_USER" --password-stdin
                        docker push "$BUILD_IMAGE_TAG"
                        docker push "$LATEST_IMAGE_TAG"
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy locally') {
            steps {
                sh '''
                    docker rm --force "$CONTAINER_NAME" 2>/dev/null || true
                    docker run --detach \
                        --name "$CONTAINER_NAME" \
                        --publish "$HOST_PORT:$CONTAINER_PORT" \
                        --restart unless-stopped \
                        "$BUILD_IMAGE_TAG"
                '''
                echo "Application deployed at http://localhost:${HOST_PORT}"
            }
        }
    }
}
