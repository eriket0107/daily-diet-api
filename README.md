# Daily Diet Application

This repository contains the source code for a Daily Diet application. The application allows users to track their meals, including whether they are within or outside of their diet. It also provides metrics on the user's dietary habits.


## Using *Sqlite*

- set in .env DB_TYPE variable as sqlite
`DB_TYPE=sqlite`

## Using *Postgres* 

- follow docker process
- set in .env DB_TYPE variable as pg
`DB_TYPE=pg`

## Prerequisites

- Docker installed on your machine

## Running the Application with Docker

bash `docker build -t daily-diet-app .`

### Building the Docker Image

1. Open a terminal in the root directory of your project.
2. Run the following command to build the Docker image:

 This command builds a Docker image named `daily-diet-app` from the Dockerfile in the current directory.

### Running the Docker Container

1. After building the image, run the following command to start a Docker container:

bash `docker run -d --name daily-diet-container -p 5432:5432 daily-diet-app`

## App Rules

- [X] It should be possible to create a user
- [X] It should be possible to identify the user between requests
- [X] It should be possible to register a meal made, with the following information:

- *The meals must be related to a user*
- Name
- Description
- Date and Time
- Whether it is within or not the diet

- [X] It should be possible to edit a meal, being able to change all the data above
- [X] It should be possible to delete a meal
- [X] It should be possible to list all the meals of a user
- [X] It should be possible to view a single meal
- [X] It should be possible to retrieve the metrics of a user
- [X] Total number of meals registered
- [X] Total number of meals within the diet
- [X] Total number of meals outside the diet
- [X] Best sequence of meals within the diet

- [X] The user can only view, edit, and delete the meals they created
- [ ] It should be possible to create another session/login with an existing user
