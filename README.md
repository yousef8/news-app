# News App

- Backend with Node.js + Express.js
- Frontend with React.js + Bootstrap for styling

## Prerequisite

- If you have `Docker` installed you can use docker-compose to install all the required depndencies, hassle free.

- If you want to run it manually, you will need
  - MongoDB
  - Redis
  - Node + npm

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the server folder

`NEWS_API_KEY` to call the newsApi.com

`DB_URL` to connect to mongodb

`JWT_SECRET` to create token

## Usage

From inside the repo directory do the following

1. create `.env` file and fill it with appropriate values

   ```bash
   cp server/.env.example server/.env
   ```

1. Build the necessary images

   ```bash
   docker compose build
   ```

1. Run docker-compose

   ```bash
   docker compose up
   ```

1. You can then access the website from the url `http://localhost:8000`

1. To stop the container run the following command inside the project directory

   ```bash
   docker compose stop
   ```
