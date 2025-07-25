
![Build Status](./logo.svg)


##  What is Waris.in?

**Waris.in** is a digital platform that serves as a direct bridge between traditional master artisans and a younger generation interested in learning from them.

This is not just another job-seeking portal; it is a movement and a platform for **CULTURAL HERITAGE regeneration**. We provide a means for masters to open the doors to their workshops and for the young generation to find their calling in preserving culture.

## 🤔 What It Does

Ever worried about a beautiful, ancient craft just... disappearing? That's the problem we're tackling. Inspired by the story of Indonesia's last keris masters, we realized that their incredible knowledge could vanish forever if no one is there to inherit it.

**Waris.in** is our answer. It's a digital bridge built to solve this exact problem:

* **For Master Artisans:** We give them a simple platform to showcase their life's work, share their stories, and open up apprenticeship opportunities. We even have a little AI helper powered by Google Gemini to assist them in writing compelling descriptions, so they can focus on what they do best: creating.

* **For Aspiring Learners:** You get a direct line to learn from the best. No more barriers. Browse unique apprenticeships, find a master whose craft speaks to you, and apply to become part of continuing a legacy.

Bottom line: this isn't just a job board. It's a movement to regenerate cultural heritage, one apprenticeship at a time.


## 💻 How We Built It

We built this project with a modern, scalable, and type-safe stack to ensure a great experience for both developers and users.

On the frontend, we went with **Next.js** using the App Router. This allowed us to leverage React Server Components for performance, giving us fine-grained control over our rendering strategy. **TypeScript** was a no-brainer to keep our codebase sane and predictable as it grew. For styling, we used **Tailwind CSS** for its utility-first approach, which let us build a custom design system quickly.

For the backend and database, we chose the powerful combination of **PostgreSQL** and **Prisma ORM**. This gives us a robust, relational database with the developer experience of a fully type-safe query builder.

Authentication is handled by **Firebase Auth**, which made it incredibly easy to set up both Google OAuth and traditional email/password sign-in flows. For file handling, **UploadThing** provided a simple and effective solution for managing image and CV uploads, integrated directly with our stack.

The "magic touch" comes from **Google Gemini**, which powers our AI Assistant feature, helping artisans craft their stories and program descriptions effortlessly.

Finally, to tie it all together, the entire application is deployed on **Vercel**, giving us a seamless CI/CD pipeline, automatic previews for every push, and world-class performance.

## ✨ Core Features (MVP)

* **Detailed Artisan Profiles:** Every master has a profile page showcasing their story & expertise 
* **Apprenticeship Opportunities:** Artisans can easily publish learning programs, complete with descriptions, duration, and the criteria they seek in an apprentice.
* **AI Assistant for Artisans:** A simple AI feature to help artisans (who may not be tech-savvy) craft compelling narratives for their profiles and program descriptions.
* **Simple Application Flow:** An easy-to-use application process for aspiring apprentices to show their interest and for masters to review candidates.

## 🏆 Accomplishments that we're proud of

Building this project was a marathon, not a sprint. While we faced our share of challenges, we're incredibly proud of what we've achieved:

* **Taming the Next.js App Router:** We didn't just use it; we wrestled with its new paradigms like React Server Components and strict data fetching patterns. Overcoming the initial learning curve was tough, but it resulted in a highly performant and well-structured application that we now understand deeply.

* **Building a Full-Stack Solution:** We successfully designed and implemented a complete, feature-rich application from the ground up, integrating everything from a relational database with Prisma to secure authentication and third-party AI services.

* **Creating a Platform with a Purpose:** More than just lines of code, we're proud to have built a platform with a real-world, positive mission. Knowing that our work could potentially help preserve a dying cultural art form is our biggest motivation and accomplishment.

* **Seamless Service Integration:** We successfully orchestrated a wide array of modern services—PostgreSQL, Firebase Auth, Google Gemini, and UploadThing—into one cohesive and functional platform, proving our ability to work with and connect disparate technologies.

## 🧠 What We Learned

This project was as much a learning journey as it was a development task. Here are our key takeaways:

* **The Importance of Technical Foresight:** Jumping into the Next.js App Router taught us a valuable lesson: choosing a framework is a critical decision with real consequences on development speed and complexity. We learned to weigh the benefits of cutting-edge technology against its learning curve.

* **True Agile Project Management:** Working under pressure with logistical hurdles forced us to be truly agile. We learned the importance of defining a clear MVP scope and practicing effective asynchronous communication to prevent bottlenecks and keep the momentum going, even when working separately.

* **A Deeper Cultural Appreciation:** This wasn't just about code. Researching the stories of artisans like Pak Sungkowo gave us a profound appreciation for the cultural heritage we aim to protect. It solidified our mission and reminded us that technology can, and should, serve a deeper human purpose.

## 🚀 What's Next for Waris.in

Our vision for Waris.in is just getting started. The current platform is a solid foundation, but we're excited about the future. Here's what's on our roadmap:

* **Testimonial & Review System:** To build trust and allow apprentices to share their experiences, we plan to implement a full testimonial feature where learners can rate and review the programs they've completed.

* **Community & Sanggar Partnerships:** We will develop features to formally onboard entire communities or studios ("sanggar"), allowing a representative to manage multiple artisan profiles, simplifying the process for masters who are less tech-savvy. 

* **AI-Powered Recommendation Engine:** To create a more personalized experience, we aim to build a recommendation system that suggests apprenticeship programs to users based on their registered interests, background, and Browse history. 

* **Enhanced Artisan Dashboards:** Providing more value to our masters by giving them analytics on their profile views, application numbers, and overall reach.

* **Interactive Workshops & Events:** Expanding beyond long-term apprenticeships to allow artisans to host paid, one-day workshops or online events, creating a new revenue stream and more learning opportunities.

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