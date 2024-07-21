const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("clear").setDescription("Clear last messages in chat").addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Number of messages to delete')
      .setRequired(true)
  ),
  async execute(interaction) {
    if (
      !(
        interaction.member.permissions.has("Administrator")
      )
    ) {
      return interaction.reply(
        "You do not have permission to use this command."
      );
    }
    const amount = interaction.options.getInteger('amount');

    if (amount < 1 || amount > 100) {
      return interaction.reply('Only up to 100 messages can be deleted.');
    }

    const messages = await interaction.channel.messages.fetch({ limit: amount });

    interaction.channel.bulkDelete(messages, true)
      .then(deletedMessages => {
        interaction.reply(`Deleted ${deletedMessages.size} messages.`).then(msg =>{
            setTimeout(()=>{
                msg.delete()
            }, 2000)
        });
      })
      .catch(err => {
        console.error(err);
        interaction.reply('There was an error trying to delete messages in this channel.');
      });
  },
};