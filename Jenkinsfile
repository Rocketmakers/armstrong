node('macosx') {
    ws("/Users/jenkins/build/armstrong.react/${env.BRANCH_NAME.replace('/', '-')}") {
        checkout scm
        echo "Running on a Mac OSX Node"
        echo "Branch is: ${env.BRANCH_NAME}"
        sh 'nodenv update-version-defs'
        sh 'nodenv install || :'
        sh 'cd armstrong-react'
        sh 'yarn'
        sh 'npm run build'
        if (env.BRANCH_NAME == "master"){
          sh 'npm publish'
        }
    }
}
