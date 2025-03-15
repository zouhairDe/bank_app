# Bank App - Under Development

**Important:** This project is currently unfinished due to time constraints on both developers. It represents our progress to date.

## Description

[Provide a brief description of your bank application. What is its purpose? What problem does it solve? What are its key features?]

For example:

> This is a web application for managing bank accounts, transactions, and user profiles. It aims to provide a simple and intuitive interface for users to track their finances. Key features include:
>
> *   Account creation and management
> *   Transaction history
> *   User authentication and authorization
> *   Admin commands for managing accounts (e.g., deleting accounts, adding money)
> *   Linking accounts for multiple login methods (e.g., email & password, Google, GitHub)
> *   Credit Cards generation&verification using luhn algorithm which the algorithm used in reality, for more info refere to : [Luhn algorithm](https://www.investopedia.com/terms/l/luhn-algorithm.asp)
> *   A Database seeder for tests (prisma/seed.ts)

## Technologies Used

*   [Next.js](https://nextjs.org/) - React framework for building web applications
*   [Prisma](https://www.prisma.io/) - ORM for database access
*   [Tailwind CSS](https://tailwindcss.com/) - CSS framework for styling
*   [Add other technologies used, e.g., NextAuth.js, TypeScript, etc.]

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/zouhairDe/bank_app.git]
    cd [bank_app]
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the database:**

    *   Configure your database connection in the [.env](http://_vscodecontentref_/0) file.  Refer to the `.env.example` if you have one, or create the necessary environment variables.
    *   Run the Prisma migrations:

        ```bash
        npx prisma migrate dev
        ```

4.  **Run the application:**

    ```bash
    npm run dev
    ```

    Open your browser and navigate to `http://localhost:3000` (or the port specified in your [.env](http://_vscodecontentref_/1) file).

## Project Structure
