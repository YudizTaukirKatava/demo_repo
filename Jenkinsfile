pipeline{
  agent any
  stages{
    stage('build'){
      steps{
        sh 'mkdir -p demo_dir'
        sh 'pwd'	
	dir('/var/lib/jenkins/workspace/demo/demo_dir') {
   		sh 'pwd'
	}     
      }  
    }
  }
}
