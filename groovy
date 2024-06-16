pipeline {
    agent any
parameters {
  base64File description: 'Uploads', name: 'FILE'
    activeChoice choiceType: 'PT_MULTI_SELECT', description: 'Select the browsers', filterLength: 1, filterable: false, name: 'Browsers', randomName: 'choice-parameter-3357113069137900', script: scriptlerScript(isSandboxed: true, scriptlerBuilder: [builderId: '1716302544592_3', parameters: [], propagateParams: false, scriptId: 'browsers.groovy'])
}
    stages {
        stage('process input file'){
            steps{withFileParameter('FILE') {
                bat 'copy /Y %FILE% %WORKSPACE%\\Sample.xlsx'
                }
            }
        }
    }
}
