pipeline {
    agent any
    stages {
        stage('Stage 1') {
            steps {
                echo "====THIS IS STAGE 1===="
            }
            post {
                success {
                    echo "Stage 1 succeeded, skipping Stage 2"
                }
                failure {
                    echo "Stage 1 failed, proceeding to Stage 2"
                    // Actions for Stage 2 if Stage 1 fails
                    // For example, you can call a function or run some other steps here
                    stage('Stage 2') {
                        steps {
                            // Your actions for Stage 2 here
                            echo "====THIS IS STAGE 2===="
                        }
                    }
                }
            }
        } 
    }
}
