#!/usr/bin/env node

const chalk = require('chalk')
const clear = require('clear')
const files = require('./lib/files')
const figlet = require('figlet')
const Configstore = require('configstore')
const conf = new Configstore('ginit')
const github = require('./lib/github')
clear()
console.log(
    chalk.yellow(
        figlet.textSync('Ginit', { horizontalLayout: 'full' })
    )
)
const inquirer = require('./lib/inquirer')
const getGithubToken = async() => {
    // Fetch token from config store
    let token = github.getStoredGithubToken()
    if (token) {
        return token
    }

    // No token found, use credentials to access GitHub account
    await github.setGithubCredentials()

    // register new token
    token = await github.registerNewToken()
    return token
}

const run = async() => {
    try {
        
        if (process.argv.slice(2) == "test")
        {
            console.log("Ginit installed properly ");
        }
        else{
        // Retrieve & Set Authentication Token
        const token = await getGithubToken()
        github.githubAuth(token)

        // Create remote repository
        const url = await repo.createRemoteRepo()

        // Create .gitignore file
        await repo.createGitignore()

        // Set up local repository and push to remote
        const done = await repo.setupRepo(url)
        if (done) {
            console.log(chalk.green('All done!'))
        }
    }
    } catch (err) {
        if (err) {
            switch (err.code) {
                case 401:
                    console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'))
                    break;
                case 422:
                    console.log(chalk.red('There already exists a remote repository with the same name'))
                    break;
                default:
                    console.log(err)
            }
        }
    }
}

run()