
![Build Status](./logo.svg)


##  What is Waris.in?

**Waris.in** is a digital platform that serves as a direct bridge between traditional master artisans and a younger generation interested in learning from them.

This is not just another job-seeking portal; it is a movement and a platform for **CULTURAL HERITAGE regeneration**. We provide a means for masters to open the doors to their workshops and for the young generation to find their calling in preserving culture.

## ✨ Core Features (MVP)

* **Detailed Artisan Profiles:** Every master has a profile page showcasing their story & expertise 
* **Apprenticeship Opportunities:** Artisans can easily publish learning programs, complete with descriptions, duration, and the criteria they seek in an apprentice.
* **AI Assistant for Artisans:** A simple AI feature to help artisans (who may not be tech-savvy) craft compelling narratives for their profiles and program descriptions.
* **Simple Application Flow:** An easy-to-use application process for aspiring apprentices to show their interest and for masters to review candidates.

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![UploadThing](https://img.shields.io/badge/UploadThing-CC33FF?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E72D6?style=for-the-badge&logo=googlegemini&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

  
## ⚙️ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Miku-Miku-Beam/warisin-webapp.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd warisin-webapp
    ```
3.  **Install all dependencies (choose one):**
    ```bash
    bun install
    # OR
    npm install
    ```
4.  **Create your environment file from the example:**
    ```bash
    cp .env.example .env
    ```
    Then, open the `.env` file and fill in all the required environment variables (database URL, Firebase keys, etc.).

5.  **Generate the Prisma Client:**
    ```bash
    bun prisma generate
    ```

6.  **Run the development server:**
    ```bash
    bun dev
    ```
7.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.
   
## Challenges We Ran Into

Every project has its hurdles. Here are the key challenges we faced and how we overcame them:

* ### Mastering the Next.js App Router Paradigm

    We intentionally stepped out of our comfort zone by building this project with the Next.js App Router. This presented a steep learning curve, particularly with the paradigm shift to React Server Components (RSC) and its granular, strict architecture. Initially, this slowed down our development velocity as we had to rethink familiar patterns for data fetching, state management, and component composition. However, by pushing through, we gained a much deeper understanding of modern web architecture, which ultimately resulted in a more performant and well-structured application.

* ### Adapting to Asynchronous Collaboration

    In the early stages, we faced logistical issues that impacted our access to real-time project management tools. This forced us to quickly adapt to a more asynchronous workflow. Instead of relying on constant connectivity, we emphasized clear, concise documentation for tasks and relied on disciplined self-management to keep the project timeline on track. This experience taught us the importance of robust offline planning and strong individual ownership within the team.
## 📄 License

This project is licensed under the MIT License.