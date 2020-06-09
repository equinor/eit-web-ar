# How we work

## Overview

- Project board [The Board](https://github.com/equinor/eit-web-ar/projects/1)
- MS Team ["EIT Web AR"](https://teams.microsoft.com/_#/conversations/General?threadId=19:708913ac4afa4aefb645f0096907f015@thread.tacv2&ctx=channel) (`1c15fcc6-3f69-4db7-a8ee-b4d86c293c35`)


## Idea to Code flow

Kanbanish.

1. Register new ideas in the `Backlog` list
1. Discuss new ideas in daily or weekly summary
1. If the team consider the new idea is a _Great Idea_ then convert it into a task (feature, bugfix etc)  
   1. Add scope (what is it supposed to do, be as exact as possible)
   1. Add Definition of Done (checklist)  
      Mandatory DoD items are
      - Code review done
      - Code pushed to production
   1. Review story with fellow team member
   1. Push the task into `To do` list
   1. Prioritize when it should be done (use sort order, most important at the top of the list)
1. Work with the most important tasks first, and push the task into the `In progress` list  
   For task-to-code, see [Development flow](#development-flow)
1. When task is done (DoD completed) then
   1. Close the task (git issue)
   1. Push task into list `Done`
   1. Loop :)


## Development flow

Use [trunk based development](https://trunkbaseddevelopment.com/) as the main guideline for how to push your code all the way to production.

1. Features or bugfixes are developed in short lived (a few days max) branches
1. Features or bugfixes branches are then squashed, code reviewed and merged into the trunk, the `master` branch   
   The trunk is where we integrate new code into the rest of the code base to verify that it play nice with others.  
1. As soon as we can verify that the trunk is still ok then we push the code to production by merging the `master` branch into the `release` branch

### Roll forward, avoid rollback

It is usually faster and less prone to errors to add a bugfix then to roll code back.

### Why squash feature branches? 

The interesting parts of a app history is when, what and why  
- _When_ is available in the diff
- _What_ is available in the diff
- _Why_ is the context you have to provide in the form of a commit message

Squashing the feature branch before merging into the trunk will remove clutter from the release history and make it easy to read as to why something was added to the code base.  
Clutter commits like "Fixed my typo", "Oh, fixed another typo over there" are all normal parts of developing a feature, squashing lets us remove the clutter and leave only the context of why when merging the feature into the trunk.  

On the topic of commit messages...

### How to write a good commit message  

A commit message should be concise and consistent. Look at it as a way to communicate context about a change to other developers. The details of what you changed are always available in the diff, you add _why_ you changed it in the message.  
For great examples then read
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [NAV - Om å skrive gode commit-meldinger](https://github.com/navikt/offentlig/blob/master/guider/commit-meldinger.md)



### Example: I want develop feature A

#### Step 1: Create a feature branch
 
1. Create a feature branch from branch `master`, ie "feature-A"  
   ```sh
   # Be sure that you got the latest changes in local repo
   git checkout master
   git pull
   git checkout -b "feature-A"
   ```

_Iterate_
1. Develop, commit and push changes to your feature branch
1. When you think you are done, go to step 2

#### Step 2: Create a pull request and survive code review

1. Open the repo on github in a browser
1. Create a pull request to merge your feature into branch `master`  
1. In your pull request, select a team member to perform the code review
1. If code is not ok then add changes to your existing feature branch and push.  
   The pull request will be automatically updated when you push.  
   Repeat until you and the reviewer are happy.
1. When code review is approved then the developer who wrote the code should perfom the merge into the trunk
   1. Github will help you squash the commits in the browser
   1. Ensure that the final commit message is [Good&#8482;](#how-to-write-a-good-commit-message)
   1. Delete the branch when done
      1. Delete remote branch in browser
      1. Delete local branch
         ```sh
         git checkout master
         git pull
         git branch -D "feature-A"
         ```

#### Step 3: Verify that your code play nice with others

1. Verify in local environment
1. Verify in QA environment

#### Step 4: Push code into production

1. Merg branch `master` into `release`  
   ```sh
   # Be sure that master has latest changes
   git checkout master
   git pull
   # Be sure that release has latest changes
   git checkout release
   git pull
   # Finally merge master into release
   git merge master
   git push
   ```
1. Verify production environment

#### Done!

Highfive, grab a coffe and get going with the next feature.


### Troubleshooting

#### Rebase manually

```sh
# Squash all your commits into a single commit to make it easier to read for the code reviewer by using git rebase
git checkout "feature-A" # Make sure you are in your feature branch
git fetch origin master # Get latest changes in master before rebasing
git rebase -i origin/master # The -i will open up an editor. Follow the instructions and squash all commits into the first commit.
git push -f # Rebase will put your changes after all other changes in the branch you rebased into. Convince your remote branch that you know what you are doing by force
```