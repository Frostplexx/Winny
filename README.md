# Winny Discord Bot

Winny is a discord bot that serves as a companion to the Winston Reddit app. The bot helps to manage, display, and download themes. It provides a theme store, and in general, enhances your Discord experience.

## Getting Started

In order to get a local copy up and running, follow these steps:

### Prerequisites

- A Discord account.
- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-github-username/winston-discord-bot.git
   ```

2. Install NPM packages:

   ```sh
   npm install
   ```

3. Create and set up your `.env` configuration file. Make it look like this:

   ```dotenv
   CLIENT_ID=<your-discord-client-id>
   TOKEN=<your-discord-token>
   BEARER=<your-bearer-token>
   ```

   Replace `<your-discord-client-id>`, `<your-discord-token>`, and `<your-bearer-token>` with your Discord Client ID, Discord Token, and Bearer token respectively.

### Running Winny

After setting up, you should be able to run Winny by executing:

```shell
npm run start
```

### Contributing

If you want to contribute to this project, follow the steps below:
1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

### License
This project is licensed under the GPLv3 License. See LICENSE for more information.
