# Bank App - Under Development

**Important:** This project is currently unfinished due to time constraints on both developers. It represents our progress to date.

## Description

[Provide a brief description of your bank application. What is its purpose? What problem does it solve? What are its key features?]

For example:

> This is a web application for managing bank accounts, transactions, and user profiles. It aims to provide a simple and intuitive interface for users to track their finances. Key features include:
>
> * Account creation and management
> * Transaction history
> * User authentication and authorization
> * Admin commands for managing accounts (e.g., deleting accounts, adding money)
> * Linking accounts for multiple login methods (e.g., email & password, Google, GitHub)
> * Credit card generation & verification using the Luhn algorithm, which is used in real-world applications. For more information, refer to: [Luhn algorithm](https://www.investopedia.com/terms/l/luhn-algorithm.asp)
> * A database seeder for tests (`prisma/seed.ts`)

## Technologies Used

* [Next.js](https://nextjs.org/) - React framework for building web applications
* [Prisma](https://www.prisma.io/) - ORM for database access
* [Tailwind CSS](https://tailwindcss.com/) - CSS framework for styling
* [Rive](https://rive.app/) - For a small robot that follows your mouse cursor
* [Motion](https://motion.dev/) - For animations

## Setup Instructions

1. **Clone the repository:**

    ```bash
    git clone https://github.com/zouhairDe/bank_app.git
    cd bank_app
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up the database:**

    * Configure your database connection in the `.env` file. Refer to the `.env.example` file if available, or create the necessary environment variables.
    * Run the Prisma migrations:

        ```bash
        npx prisma migrate dev
        ```

4. **Run the application:**

    ```bash
    npm run dev
    ```

    Open your browser and navigate to `http://localhost:3000` (or the port specified in your configuration files such as `package.json` or `.env`).

## Project Structure

```
 ├── .next/                 # Next.js build output
 ├── app/                   # Next.js application directory
 ├── context/               # React context providers
 ├── hooks/                 # Custom React hooks
 ├── lib/                   # Utility functions and helper modules
 ├── prisma/                # Prisma database schema and migrations
 ├── public/                # Static assets
 ├── ui/                    # Reusable UI components
 ├── .env                   # Environment variables
 ├── next.config.mjs        # Next.js configuration
 ├── package.json           # Project dependencies and scripts
 ├── postcss.config.mjs     # PostCSS configuration
 ├── tailwind.config.ts     # Tailwind CSS configuration
 └── tsconfig.json          # TypeScript configuration
```

## Known Issues and Missing Features

* Accounts&Cards listing
* Transaction history page and other related pages

## Contributing

We welcome contributions from anyone, So if you would like to contribute, please follow these steps:

1. **Fork the repository** on GitHub.
2. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. **Make your changes** and ensure they are well-documented and tested.
4. **Commit your changes** with a descriptive commit message:
   ```bash
   git commit -m "Added feature XYZ"
   ```
5. **Push the changes** to your forked repository:
   ```bash
   git push origin feature-name
   ```
6. **Submit a pull request (PR)** to the main repository. I will review and merge your PR if it meets the project's standards.

If you need any clarification or assistance, feel free to open an issue.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the `LICENSE` file for more details.

