# A Goal setter application in MERN

![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## Features

- User authentication and authorization
- Create, update, and delete goals
- Set deadlines and reminders for goals
- Track progress of goals
- Categorize goals by priority or type
- Share goals with friends or team members
- Receive notifications for upcoming deadlines
- View goal history and achievements
- Responsive design for mobile and desktop
- Integration with calendar apps
- Data encryption and security
- User-friendly interface
- Analytics and reporting on goal progress
- Social media sharing options
- Customizable goal templates
- Support for multiple languages
- Dark mode and light mode options
- Regular updates and new features

These are the suggested features a goal setting app should have. This application over a period of time would eventually contain some of these features.

## Deployment using Docker

```
version: '3.8'
services:
  express:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: express_goals
    ports:
      - 5000:5000
    depends_on:
      - mongo

  mongo:
    image: mongo
    container_name: mongo_goals
    restart: unless-stopped
    volumes:
      - ./mongo_data:/data/db
    ports:
      - '27017:27017'

  nginx:
    image: nginx
    container_name: nginx_goals
    restart: unless-stopped
    ports:
      - '80:80'
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - express

volumes:
  mongo_data:
    external: true
```

This uses Docker containers for deployment. We have containers for Nginx, the back-end and mongodb database. Before running the docker-compose command we create a front-end build using the command 
from inside the client folder.

```
npm run build
```

