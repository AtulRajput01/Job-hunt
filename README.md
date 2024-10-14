# JobWright

<div id="top"></div>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![styled-components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

<!-- PROJECT LOGO -->
<div align="center">
<br>
<br>
<br>

![hunt0](https://github.com/user-attachments/assets/4241f219-b31f-4368-acf9-641492fac2b0)
![hunt1](https://github.com/user-attachments/assets/a5cad2a3-1460-4841-9ae2-dcf8c5eefb7a)
![hunt2](https://github.com/user-attachments/assets/9d535923-e32b-4fe8-977c-474fdb9c2dcc)
![hunt4](https://github.com/user-attachments/assets/16e345d8-7d21-4546-babd-0829169a8310)

</div>

<!-- MONITORING -->

## Monitoring
![monit](https://github.com/user-attachments/assets/75425731-1178-40d4-bd02-6b44d04039dc)

For monitoring the application's health and performance, we are utilizing Prometheus, Grafana, and Loki.

- **Prometheus** is used for scraping and collecting application metrics, providing real-time monitoring and alerting capabilities.
- **Grafana** is integrated with Prometheus to visualize the data, allowing for detailed and customizable dashboards.
- **Loki** is employed for logging, enabling efficient and scalable log aggregation, search, and monitoring alongside the metrics in Grafana.

This monitoring stack ensures that the system remains reliable and that any performance bottlenecks or issues can be quickly identified and resolved.

<p align="right">(<a href="#top">back to top</a>)</p>




<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#users">Users</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#ports-and-endpoints">Ports and EndPoints</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

MERN Stack Application for tracking Job Search Process


### Features

- Login / Sign-up
- Edit user-data
- Add jobs
- Browse user's jobs with (search + filter) feature
- Display jobs-status + monthly-applications in graphs

### Built With

- React
- React Router
- styled-components
- Node.js
- Express
- MongoDB

### users

| Email                 | Password |
| --------------------- | -------- |
| atul@gmail.com | 123456   |

#### Validation

- **Email validation**: as per **RFC2822** standards.
- **Password validation**:
  - The password must be more than **6** characters.

<p align="right">(<a href="#top">back to top</a>)</p>

---

<!-- GETTING STARTED -->

## Getting Started

This project require some perquisites and dependencies to be installed, you can find the instructions below

This project require some perquisites and dependencies to be installed, you can view it online using this . or you can find the instructions below:

> To get a local copy, follow these simple steps :

### Installation

#### installing Locally

1. Clone the repo
   ```sh
   git clone https://github.com/abhishekchauhan15/JobWright.git
   ```
2. go to project folder

   ```sh
   cd client
   ```

3. install dependencies

   ```bash
   npm run install
   ```

4. Environmental Variables Set up

   - Here are the environmental variables that needs to be set in the `.env` file in the **server directory**.
   - These are the default setting that I used for development, but you can change it to what works for you.

   ```
     PORT=5000
     MONGO_URL=<Your mongodb url>
     JWT_LIFETIME=1d
     JWT_SECRET=<any secret value of your choice>
   ```

5. Run development server

   ```sh
   npm start
   ```

---

### Ports and EndPoints

#### Ports

- FrontEnd Development Server runs on port `3000`
- BackEnd Development Server runs on port `5000`

#### API endpoints

**Main URL**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

- **Auth**

  - Register User: [http://localhost:5000/api/v1/auth/register](http://localhost:5000/api/v1/auth/register) [POST]
  - Register User: [http://localhost:5000/api/v1/auth/login](http://localhost:5000/api/v1/auth/login) [POST]
  - Update User: [http://localhost:5000/api/v1/auth/updateUser](http://localhost:5000/api/v1/auth/updateUser) [PATCH]

- **Jobs**

  - Get all jobs: [http://localhost:5000/api/v1/jobs?status=all&jobType=all&page=1](http://localhost:5000/api/v1/jobs?status=all&jobType=all&page=1) [GET]
  - Create job: [http://localhost:5000/api/v1/jobs](http://localhost:5000/api/v1/jobs) [POST]
  - Update job: [http://localhost:5000/api/v1/jobs/:id](http://localhost:5000/api/v1/jobs/:id) [PATCH]
  - Delete job: [http://localhost:5000/api/v1/jobs/:id](http://localhost:5000/api/v1/jobs/:id) [DELETE]
  - Get stats: [http://localhost:5000/api/v1/jobs/stats](http://localhost:5000/api/v1/jobs/stats) [Get]

<!-- [![Run in Postman](https://run.pstmn.io/button.svg)] -->
