const path = require("path");
const fs = require("fs");
const { Collection, REST, Routes } = require("discord.js");

function registerCommands(client, token) {
  client.commands = new Collection();
  const commands = [];
  function registerSubFolders(client, dir) {
    const files = fs.readdirSync(path.join(__dirname, dir));

    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file));

      if (stat.isDirectory()) {
        registerSubFolders(client, path.join(dir, file));
      } else {
        if (file.endsWith(".js")) {
          const command = require(path.join(__dirname, dir, file));

          if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
          } else {
            console.log(`[Error] Skipping invalid command file: ${file}`);
          }
        }
      }
    }
  }
  registerSubFolders(client, "../commands");
  deployCommands(client, token, commands);
}

async function deployCommands(client, token, commands) {
  const rest = new REST().setToken(token);

  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
      {
        body: commands,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = registerCommands;
