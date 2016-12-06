node('macosx') {
    ws("/Users/jenkins/build/hanzi.hero/${env.BRANCH_NAME.replace('/', '-')}") {
        checkout scm
        echo "Running on a Mac OSX Node"
        echo "Branch is: ${env.BRANCH_NAME} Using ${checkBranch(env.BRANCH_NAME)} config"
        sh 'nodenv update-version-defs'
        sh 'nodenv install || :'
        sh 'yarn'
        sh 'npm run build'
    }
}

def checkBranch(val) {
    val = val.split('/')[0]
    def result
    switch (val) {
        case "develop":
            result = 'dev'
            break
        case "master":
            result = 'prod'
            break
        default:
            result = 'test'
            break
    }
    result
}