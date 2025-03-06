# RawChat 🔈

RawChat is a simple application that allows users to communicate in real-time using an overlay on OBS linked to Discord.
Inspired by Cacabox's Livechat, demo available [here](https://www.youtube.com/watch?v=Qs4zvCv1Ir8).

## Project demo
>
> [!NOTE]  
> Demo is a live feed from OBS.

<https://github.com/user-attachments/assets/c5c3c629-7850-45c6-854d-b7133b03337c>

## Installation

To install and run RawChat locally, follow these steps:

1. Clone the repository:

    ```sh
    git clone https://github.com/krz0001/rawchat.git
    cd rawchat
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory:

    ```sh
    touch .env
    ```

4. Add the following environment variables to the `.env` file:

    ```env
    BOT_TOKEN=your_discord_bot_token
    BASE_URL=http://localhost
    PORT=3000
    ```

    Replace `your_discord_bot_token` with your Discord bot token.
    You can remove the `BASE_URL` and `PORT` variables if you don't need them, they're pretty much optional for local development but you might want to change the port if you deploy the app.

5. Start the development server:

    ```sh
    npm start
    ```

## Discord Bot Setup

- Create a bot account in the Discord Developer Portal and obtain your bot token.
  - <https://discord.com/developers/applications/>
- Once your app has been created, go to the "Bot" tab.
- Go to the "Installation" tab and uncheck "User Install", and set the "Install Link" to **none**.
- Reset the token and save it in a secure place. (add it to your .env file)
- Go to the "Authorization Flow" section and disable the "Public Bot" option.
- Go to the "Privileged Gateway Intents" section and enable the "Message Content Members Intent".

- Now, go back to the "OAuth2" tab - we're going to invite the bot to our server.
- In the "OAuth2 URL Generator" section, select the "bot" scope. (3rd column, 3rd row)
- In the "Bot Permissions" section, select the permissions your bot will need.
  - At a minimum, you will need the following permissions:
    - View Channels
    - Send Messages
    - Add Reactions
    - Read Message History
- Copy the generated URL and paste it into your browser. You will be prompted to select a server to invite the bot to.

You can get instructions on how to use the bot by typing `!help` in the chat.

## Usage

Once the development server is running, you can access the application at `http://localhost:3000`. Register a new account or log in with an existing account to start chatting.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any features, bug fixes, or enhancements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
