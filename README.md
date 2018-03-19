# Git-MS

Git-ms allows you to manage multiple git repository as one project.

## Install
```
npm install -g git-ms
```

## Usage

### Create a project

```
git-ms add project MyProject
```

Then add your repositories to your project by using
```
git-ms add microservice MyProject MyRepo1
```

If you don't want to add all your repositories one by one, you can use the discover option.
```
git-ms add -d "path/to/my/repositories"
```

The created project wiil be named as the given directory. Every git repositories found in this directory will be added as a microservice
of the project.

### Set a project as current

```
git-ms use <Name of the project>
```

Every command will be executed on this project. If you don't want to set a project as current you can use th option
`-p <Name of the project>`.

### List the projects

By default the command `ps` will list all the microservices of a project. Use the option `--all` to list all the projects.
```
git-ms ps --all
```

### Checkout branches

You can use the command `checkout` on a project to change the current branch of every microservice on the given one
```
git-ms checkout master
```

### Tags
Tags are usefull to tag a given state of your project. If you work on the feature A which impact multiple branches of different
microservices you can tag your project to save the current configuration.

#### Add a tag
```
git-ms add tag MyProject FeatureA
```

### Use a tag
```
git-ms tag FeatureA
```

Your microservices will checkout on the saved branches.

### Monitor
You can use git-ms via its terminal interface.
```
git-ms monitor
```