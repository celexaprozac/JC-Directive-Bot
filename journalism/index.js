require('dotenv').config();
const path = require('path');
const { WebhookClient, ActivityType, time, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const prefix = '*';
const fs = require('fs');


__dirname = path.resolve();



// God help me

// Yes god help me


const commands = [
    new SlashCommandBuilder()
        .setName('inactivity')
        .setDescription('Submit inactivity log')
        .addStringOption(o => o.setName('username').setRequired(true))
        .addStringOption(o => o.setName('inactivity_reason').setRequired(true))
        .addIntegerOption(o => o.setName('inactivity_days').setRequired(true)),

    new SlashCommandBuilder()
        .setName('submit')
        .setDescription('Submit application'),
    
    new SlashCommandBuilder()
        .setName('radio-start')
        .setDescription('Start the radio'),
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands.map(cmd => cmd.toJSON()) }
        );

    } catch (error) {
        console.error(error);
    }
})();



const client = new Discord.Client({
    allowedMentions: {
        parse: [`users`, `roles`],
        repliedUser: true,

    },

    intents: [
        "Guilds",
        "GuildMessages",
        "GuildPresences",
        "GuildMembers",
        "GuildMessageReactions",
        "MessageContent",
        "GuildVoiceStates"
    ],
});

client.setMaxListeners(20);

function randomString(length, chars) {
  var mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  var result = '';
  for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
  return result;
}




const activities_list = [
    "/submit",
    "the news.",
    "the protest."
];

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    const args = message.content.slice(prefix.length).trim().match(/(?:[^\s"]+|"[^"]*")+/g);
    const command = args.shift().toLowerCase();
  
    if (command === 'embed') {
      const deletem = false;
      if (!message.member.permissions.has("ADMINISTRATOR")) {
        message.react('❌');
        return;
      }
      try {
        const deletem = true;
        const colour = args.shift().replace(/"/g, '');
        const title = args.shift().replace(/"/g, '');
        const description = args.join(' ').replace(/"/g, '');
        const embed = new Discord.EmbedBuilder()
          .setTitle(title)
          .setDescription(description)
          .setColor(colour);
        message.channel.send({ embeds: [embed] });
        if (deletem == true) {
            message.delete();
        }
       } catch (error) {
        console.error(error);
        const deletem = false;
        message.react('⚠️');
        return;
       }
    }
  });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        client.user.setActivity(activities_list[index], { type: ActivityType.Listening });
    }, 15100);
});


// SEPERATORRRRRRRRRRRRRRRRRRR
// SEPERATORRRRRRRRRRRRRRRRRRR
// SEPERATORRRRRRRRRRRRRRRRRRR

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
  
    try {
      if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
  
        if (command === 'mimic') {

          if (!message.member.permissions.has("ADMINISTRATOR")) {
            message.react('❌');
            return;
          }


          let content = args.join(' ');
          let attachment = null;
  
          if (message.attachments.size > 0) {
            const attachmentArray = Array.from(message.attachments.values());
            attachment = attachmentArray[0].url;
          }
  
          message.delete();
  
          if (attachment) {
            message.channel.send({ content: content, files: [attachment] });
          } else {
            message.channel.send(content);
          }
        }
      }
    } catch (error) {
      console.error(error);
      message.react('⚠️');
      return;
    }
  });



// SEPERATORRRRRRRRRRRRRRRRRRR
// SEPERATORRRRRRRRRRRRRRRRRRR
// SEPERATORRRRRRRRRRRRRRRRRRR


// Inactivity

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'inactivity') {
    const reviewChannel = client.channels.cache.get('1115827671709003906');
    const inactivityChannel = client.channels.cache.get('761568862353096745');
    const username = interaction.options.get('username')?.value.toString();
    const reason = interaction.options.get('inactivity_reason')?.value;
    const secondsAdded = interaction.options.get('inactivity_days')?.value * 86400
    const date = new Date();
    const timeString = time(date).toString().replace('<t:', '').replace('>', '');
    const addition = parseInt(timeString) + secondsAdded;
    const finalDate = addition.toString()

    const embed = new Discord.EmbedBuilder()
      .setTitle(`${username}'s Inactivity Log`)
      .setDescription(`Returning in <t:${finalDate}:R>`)
      .setFields(
        { name: 'Reason', value: reason }
      )
      .setColor('#704CF6')
      .setThumbnail(`https://minotar.net/helm/${username}/180.png`)
      .setFooter({ text: 'Journalism Club | Inactivity Log' })

    const embed2 = new Discord.EmbedBuilder()
      .setTitle(`${username}'s Inactivity Log`)
      .setDescription(`Returning in <t:${finalDate}:R>`)
      .setColor('#704CF6')
      .setThumbnail(`https://minotar.net/helm/${username}/180.png`)
      .setFooter({ text: 'Journalism Club | Inactivity Log' })

    interaction.reply({
      content: 'Your inactivity log has been put in, you will be contacted regarding it if there are any issues!',
      ephemeral: true,
    })

    reviewChannel.send( { content: `### <@&1125223842432946196> new inactivity log.`, embeds: [embed] } );
    inactivityChannel.send( { embeds: [embed2] } );

  }

})



// Intercom request

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'intercom-request') {
    const requestChannel = client.channels.cache.get('1125495449395150871');
    const username = interaction.options.get('username')?.value.toString();
    const type = interaction.options.get('intercom_type')?.value;
    const message = interaction.options.get('intercom_message')?.value;

    const date = new Date();
    const timeString = time(date).toString().replace('<t:', '').replace('>', '');
    const addition = parseInt(timeString)
    const finalDate = addition.toString()

    const embed = new Discord.EmbedBuilder()
      .setTitle(`${username}'s Intercom Request`)
      .setDescription(`Requested <t:${finalDate}:f>`)
      .setFields(
        { name: 'Type', value: type },
        { name: 'Message', value: message }
      )
      .setColor('#704CF6')
      .setThumbnail(`https://minotar.net/helm/${username}/180.png`)
      .setFooter({ text: 'Journalism Club | Intercom-Request' })

    interaction.reply({
      content: 'Your intercom request has been put in!',
      ephemeral: true,
    })

    requestChannel.send( { content: `### <@&1124989477820059748> new intercom-request.`, embeds: [embed] } );

  }

})



// shorten link

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'shorten-link') {
    const link = interaction.options.get('link')?.value.toString();
    const shortened = link.replace(/\D/g,'');

    interaction.reply({
      content: `Here is your shortened forum link: https://schoolrp.net/t/${shortened}/`,
      ephemeral: true,
    })

  }

})



// create intercom

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'create-intercom') {
    const username = interaction.options.get('username')?.value.toString();
    const rpname = interaction.options.get('character_name')?.value.toString();
    const message = interaction.options.get('intercom_message')?.value.toString();

    interaction.reply({
      content: `Here is your formatted intercom message:
      
      &6[&c&lINTERCOM&6] &7&o(${username}) &f${rpname} says "${message}"`,
      ephemeral: true,
    })

  }

})


// DM

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'dm') {
    const userid = interaction.options.get('user')?.value.toString();
    const subject = interaction.options.get('dm_subject')?.value.toString();
    const message = interaction.options.get('dm_message')?.value.toString();

    const embed = new Discord.EmbedBuilder()
      .setTitle(` `)
      .setDescription(`# ${subject}
      
      ${message}`)
      .setColor('#704CF6')
      .setFooter({ text: 'Journalism Club | Direct Message' })

    const senderTag = interaction.user.tag;
    console.log(`${senderTag} send a DM: `, message);

    client.users.fetch(userid).then((user) => user.send( { embeds: [embed] } ));

    interaction.reply({
      content: `Sent the DM to <@${userid}>`,
      ephemeral: true,
    })

  }

})


// Kill me




client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'create-topic') {
    const trequestChannel = client.channels.cache.get('1148067065438146631');
    const username = interaction.options.get('username')?.value.toString();
    const user = interaction.user;
    const topic = interaction.options.get('topic')?.value;

    const embed = new Discord.EmbedBuilder()
      .setTitle(` `)
      .setDescription(`## Topic Of Interest
      
      ${topic}`)
      .setColor('#704CF6')
      .setThumbnail(`https://minotar.net/helm/${username}/180.png`)
      .setFooter({ text: 'Journalism Club | Topic Of Interest' })

    interaction.reply({
      content: 'Your topic has been suggested!',
      ephemeral: true,
    })

    trequestChannel.send( { content: `### <@&1148068200655892661> new topic.`, embeds: [embed] } );

  }

})


// NEW CREATE REPORT

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'create-report') {

    const createReport = new Discord.ModalBuilder()
      .setTitle(`Report Submission`)
      .setCustomId('createreport')

    const username = new Discord.TextInputBuilder()
      .setCustomId('username')
      .setMinLength(3)
      .setMaxLength(16)
      .setPlaceholder('e.g. Customable')
      .setRequired(true)
      .setLabel('What is your username?')
      .setStyle(TextInputStyle.Short)

    const rpname = new Discord.TextInputBuilder()
      .setCustomId('rpname')
      .setMinLength(5)
      .setMaxLength(35)
      .setPlaceholder('e.g. Mee-young Jaibatsume')
      .setRequired(true)
      .setLabel('What is your character name?')
      .setStyle(TextInputStyle.Short)

    const link = new Discord.TextInputBuilder()
      .setCustomId('link')
      .setMinLength(10)
      .setMaxLength(100)
      .setPlaceholder('e.g. https://www.google.co.uk/docs/')
      .setRequired(true)
      .setLabel('Report Link')
      .setStyle(TextInputStyle.Short)

    const name = new Discord.TextInputBuilder()
      .setCustomId('name')
      .setMinLength(5)
      .setMaxLength(50)
      .setPlaceholder('e.g. The NPC-ification of Karakura High')
      .setRequired(true)
      .setLabel('Report Name')
      .setStyle(TextInputStyle.Short)

    const summary = new Discord.TextInputBuilder()
      .setCustomId('summary')
      .setMinLength(15)
      .setMaxLength(600)
      .setPlaceholder('My report focuses on the...')
      .setRequired(true)
      .setLabel('Summary of Report')
      .setStyle(TextInputStyle.Paragraph)

    const modalUsername = new ActionRowBuilder().addComponents(username)
    const modalRPname = new ActionRowBuilder().addComponents(rpname)
    const modalLink = new ActionRowBuilder().addComponents(link)
    const modalName = new ActionRowBuilder().addComponents(name)
    const modalSummary = new ActionRowBuilder().addComponents(summary)

    
    createReport.addComponents(modalUsername, modalRPname, modalLink, modalName, modalSummary)
    interaction.showModal(createReport)

  }

})


client.on('interactionCreate', async interaction => {

  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === 'createreport') {

    const inputUsername = interaction.fields.getTextInputValue('username');
    const inputRPname = interaction.fields.getTextInputValue('rpname');
    const inputLink = interaction.fields.getTextInputValue('link');
    const inputName = interaction.fields.getTextInputValue('name');
    const inputSummary = interaction.fields.getTextInputValue('summary');


    const reportEmbed = new Discord.EmbedBuilder()
      .setTitle(`${inputUsername}'s Report Request`)
      .setDescription(` `)
      .setFields(
        { name: 'Report Link', value: inputLink },
        { name: 'Report Name', value: inputName },
        { name: 'Report Character Name', value: inputRPname },
        { name: 'Report Summary', value: inputSummary }
      )
      .setColor('#704CF6')
      .setThumbnail(`https://minotar.net/helm/${inputUsername}/180.png`)
      .setFooter({ text: 'Journalism Club | Report-Request' })
    
    interaction.channel.send( { content: `### <@&1117895274459844608>, <@&739403941350998038> new report-request.`, embeds: [reportEmbed] } );

    await interaction.reply({ content: `Report Submitted`, ephemeral: true});

  } else if (interaction.customId === 'appsubmit') {

    const generateNumber = randomString(7, '#')

    const date = new Date();
    const timeString = time(date).toString().replace('<t:', '').replace('>', '');
    const finalDate = parseInt(timeString).toString()
    const senderID = interaction.user.id

    const submissionChannel = client.channels.cache.get('1194112358981849088');
    const Username = interaction.fields.getTextInputValue('username');
    const Applink = interaction.fields.getTextInputValue('applink');

    await interaction.reply({ content: `## Application Submission\n${Username}, Your **Journalism** Application has been submitted!\n\n> Please await any and all response to application in <#1194064966618194052>.\n> \n> __Response to applications could take between 5-30 days, please do not__:\n> * Attempt to contact any Higher-ups regarding your application unless there is an issue\n> * Delete the google document entirely to withdraw your application (contact higherups regarding it)\n> \n> You are free to alter the application at any point so long as a status *(Accepted, Pending or Denied)* has not been applied to it.\n\n**Application Reference Code:**\n* [JA-${generateNumber}](${Applink})`, ephemeral: true});

    const status = new Discord.ActionRowBuilder({
      components: [
        {
          custom_id: `accept`,
          label: `Accept`,
          style: ButtonStyle.Success,
          type: Discord.ComponentType.Button,
        },
        {
          custom_id: `pending`,
          label: `Pending`,
          style: ButtonStyle.Primary,
          type: Discord.ComponentType.Button,
        },
        {
          custom_id: `deny`,
          label: `Deny`,
          style: ButtonStyle.Danger,
          type: Discord.ComponentType.Button,
        },
      ],
    })

    const submissionEmbed = new Discord.EmbedBuilder()
      .setTitle(`${Username}'s Application`)
      .setDescription(`[${senderID}]`)
      .setFields(
        { name: 'Reference', value: `[JA-${generateNumber}](${Applink})`, inline: true },
        { name: 'Sent at', value: `<t:${finalDate}:R>`, inline: true },
      )
      .setColor('#704CF6')
      .setThumbnail(`https://minotar.net/helm/${Username}/180.png`)
      .setFooter({ text: 'Journalism Club | Application Submission' })

    submissionChannel.send( { embeds: [submissionEmbed], components: [status]} );
  } else if (interaction.customId === 'clubrequest') {

    const date = new Date();
    const timeString = time(date).toString().replace('<t:', '').replace('>', '');
    const finalDate = parseInt(timeString).toString()
    const senderID = interaction.user.id

    const submissionChannel = client.channels.cache.get('1123731520318877796');
    const Username = interaction.fields.getTextInputValue('username');
    const Request = interaction.fields.getTextInputValue('request');
    const notesValue = interaction.fields.getTextInputValue('notes');
    const Notes = notesValue.trim() !== '' ? notesValue : ' ';
    

    await interaction.reply({ content: `## Request Submission\nYour request for **${Request}** has been submitted!`, ephemeral: true});

    const status = new Discord.ActionRowBuilder({
      components: [
        {
          custom_id: `requestaccept`,
          label: `Accept`,
          style: ButtonStyle.Success,
          type: Discord.ComponentType.Button,
        },
        {
          custom_id: `requestreject`,
          label: `Reject`,
          style: ButtonStyle.Danger,
          type: Discord.ComponentType.Button,
        },
      ],
    })

    const requestEmbed = new Discord.EmbedBuilder()
      .setTitle(`${Username}'s Club Request`)
      .setDescription(`[${senderID}]`)
      .setFields(
        { name: 'What are you requesting?', value: Request },
        { name: 'Any additional notes?', value: `${Notes}` },
        { name: 'Sent by:', value: `<@${senderID}>`, inline: true },
        { name: 'Sent:', value: `<t:${finalDate}:R>`, inline: true },
      )
      .setColor('#704CF6')
      .setThumbnail(`https://minotar.net/helm/${Username}/180.png`)
      .setFooter({ text: 'Journalism Club | Request Automation' })

    submissionChannel.send( { content: `### <@&1125223842432946196> new request!`, embeds: [requestEmbed], components: [status]} );
  }
  
})

// SUBMISSION COMMAND
// SUBMISSION COMMAND
// SUBMISSION COMMAND

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'submit') {

    const applicationmodal = new Discord.ModalBuilder()
      .setTitle(`Application Submission`)
      .setCustomId('appsubmit')

    const username = new Discord.TextInputBuilder()
      .setCustomId('username')
      .setMinLength(3)
      .setMaxLength(16)
      .setPlaceholder('e.g. Customable')
      .setRequired(true)
      .setLabel('What is your username?')
      .setStyle(TextInputStyle.Short)

    const applink = new Discord.TextInputBuilder()
      .setCustomId('applink')
      .setMinLength(8)
      .setMaxLength(80)
      .setPlaceholder('https://docs.google.com/document/d/')
      .setRequired(true)
      .setLabel('Provide your application link')
      .setStyle(TextInputStyle.Short)

    const modalUsername = new ActionRowBuilder().addComponents(username)
    const modalApplink = new ActionRowBuilder().addComponents(applink)

    
    applicationmodal.addComponents(modalUsername, modalApplink)
    interaction.showModal(applicationmodal)

  }

})

// BUTTON PRESSES
// BUTTON PRESSES
// BUTTON PRESSES

client.on('interactionCreate', interaction => {
  
  if (!interaction.isButton()) return;

  const messageId = interaction.message.id;
  
  if (interaction.customId == 'accept') {
    
    //
    // Start of Accepted
    //

    interaction.channel.messages.fetch(messageId)
    .then(async message => {

      const responseChannel = client.channels.cache.get('1194112594391334942');

      const embedTitle = message.embeds[0].title;
      const embedDescription = message.embeds[0].description;
      const applicantID = embedDescription.toString().replace('[', '').replace(']', '');
      const Username = embedTitle.toString().replace(`'s Application`, ``)

      await interaction.deferUpdate();

      const filter = m => m.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

      interaction.followUp({ content: `## Application Response\n> In this channel, please type and provide any notes for __**Accepting**__ ${embedTitle}:`, ephemeral: true });

      collector.on('collect', async collected => {
        const reason = collected.content;
        collected.delete().catch(console.error);
        collector.stop('Reason collected.');

        // Do something with the reason, for example, sending it as a follow-up message
        
        await interaction.followUp({ content: `## Application Response\n> You have __**Accepted**__ ${embedTitle} with the notes: ${reason}`, ephemeral: true });
        console.log(`[JOURNALISM] ${interaction.user.tag} has ACCEPTED ${embedTitle} with the notes: ${reason}`)
        message.edit({ content: `Application was __**ACCEPTED**__ by <@${interaction.user.id}>\n\n## __Notes Given:__\n${reason}`, components: [] }).catch(console.error);

        // create embed to the channel

        const responseEmbed = new Discord.EmbedBuilder()
          .setTitle(`Your Application has been __ACCEPTED__`)
          .setDescription(`## __Notes:__\n${reason}`)
          .setThumbnail(`https://minotar.net/helm/${Username}/180.png`)
          .setColor('#704CF6')
          .setFooter({ text: 'Journalism Club | Application Status' })
        
        responseChannel.send( { content: `<@${applicantID}>`, embeds: [responseEmbed] } );
        
        // send customised embed

        const customEmbed = new Discord.EmbedBuilder()
          .setTitle(`Your Application has been __ACCEPTED__`)
          .setDescription(`Hello there, looks like your application was recently accepted, this message confirms your roles will be added within the discord server soon!\n\n> Please change your nickname within the server to the format: **Username | RPname**; You will be contacted soon regarding training by your Club Lead or a Higher Up!\n\n## Thank you for choosing Journalism!`)
          .setColor('#704CF6')
          .setThumbnail(`https://minotar.net/helm/Customable/180.png`)
          .setFooter({ text: 'Journalism Club | Application Automation' })
      
        client.users.fetch(applicantID).then((user) => user.send( { embeds: [customEmbed] } ));
        interaction.guild.members.cache.get(applicantID).roles.add(interaction.guild.roles.cache.find(i => i.name === '[J] 𝐉𝐨𝐮𝐫𝐧𝐚𝐥𝐢𝐬𝐭 | 記者'))
        interaction.guild.members.cache.get(applicantID).roles.add(interaction.guild.roles.cache.find(i => i.name === 'TRAINING'))

        const hiChannel = client.channels.cache.get('534866316075597824');
        hiChannel.send(`Hello <@${applicantID}>, Welcome to the **Journalism club!**`)

      });

      collector.on('end', collected => {
        if (collected.size === 0) {
          interaction.followUp({ content: '## Application Response\n> No reason provided. Action canceled.', ephemeral: true });
        }
      });
    })
    .catch(error => {
      console.error('Error fetching message:', error);
    });

    //
    // End of Accepted
    //

  } else if (interaction.customId == 'pending') {

    //
    // Start of Pending
    //

    interaction.channel.messages.fetch(messageId)
    .then(async message => {

      const responseChannel = client.channels.cache.get('1194112594391334942');

      const embedTitle = message.embeds[0].title;
      const embedDescription = message.embeds[0].description;
      const applicantID = embedDescription.toString().replace('[', '').replace(']', '');
      const Username = embedTitle.toString().replace(`'s Application`, ``)

      await interaction.deferUpdate();

      const filter = m => m.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

      interaction.followUp({ content: `## Application Response\n> In this channel, please type and provide any notes for choosing __**Pending**__ ${embedTitle}:`, ephemeral: true });

      collector.on('collect', async collected => {
        const reason = collected.content;
        collected.delete().catch(console.error);
        collector.stop('Reason collected.');

        // Do something with the reason, for example, sending it as a follow-up message
        
        await interaction.followUp({ content: `## Application Response\n> You have put ${embedTitle} on __**Pending**__ with the notes: ${reason}`, ephemeral: true });
        console.log(`[JOURNALISM] ${interaction.user.tag} has put ${embedTitle} on PENDING with the notes: ${reason}`)
        message.edit({ content: `Application was put on __**PENDING**__ by <@${interaction.user.id}>\n\n## __Notes Given:__\n${reason}` }).catch(console.error);

        // create embed to the channel

        const responseEmbed = new Discord.EmbedBuilder()
          .setTitle(`Your Application has put on __PENDING__`)
          .setDescription(`## __Notes:__\n${reason}`)
          .setThumbnail(`https://minotar.net/helm/${Username}/180.png`)
          .setColor('#704CF6')
          .setFooter({ text: 'Journalism Club | Application Status' })
        
        responseChannel.send( { content: `<@${applicantID}>`, embeds: [responseEmbed] } );
        
        // send customised embed

        const customEmbed = new Discord.EmbedBuilder()
          .setTitle(`Your Application has been put on __PENDING__`)
          .setDescription(`Hello there, looks like your application was put on pending, there is usually no need to worry about this as it likely means your application was good, there were simply not enough spaces within the club and we are waiting for some to open up, however, please do check the responses channel within the discord incase this is not the reason!\n\n## Thank you for choosing Journalism!`)
          .setColor('#704CF6')
          .setThumbnail(`https://minotar.net/helm/Customable/180.png`)
          .setFooter({ text: 'Journalism Club | Application Automation' })

        try {
          client.users.fetch(applicantID).then((user) => user.send( { embeds: [customEmbed] } ));
        } catch (error) {
          console.log("couldnt message radio participant")
          return;
        }

      });

      collector.on('end', collected => {
        if (collected.size === 0) {
          interaction.followUp({ content: '## Application Response\n> No reason provided. Action canceled.', ephemeral: true });
        }
      });
    })
    .catch(error => {
      console.error('Error fetching message:', error);
    });

    //
    // End of Pending
    //
      
  } else if (interaction.customId == 'deny') {

    //
    // Start of Deny
    //

    interaction.channel.messages.fetch(messageId)
    .then(async message => {

      const responseChannel = client.channels.cache.get('1194112594391334942');

      const embedTitle = message.embeds[0].title;
      const embedDescription = message.embeds[0].description;
      const applicantID = embedDescription.toString().replace('[', '').replace(']', '');
      const Username = embedTitle.toString().replace(`'s Application`, ``)

      await interaction.deferUpdate();

      const filter = m => m.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

      interaction.followUp({ content: `## Application Response\n> In this channel, please type and provide any notes for __**Denying**__ ${embedTitle}:`, ephemeral: true });

      collector.on('collect', async collected => {
        const reason = collected.content;
        collected.delete().catch(console.error);
        collector.stop('Reason collected.');

        // Do something with the reason, for example, sending it as a follow-up message
        
        await interaction.followUp({ content: `## Application Response\n> You have __**Denied**__ ${embedTitle} with the notes: ${reason}`, ephemeral: true });
        console.log(`[JOURNALISM] ${interaction.user.tag} has DENIED ${embedTitle} with the notes: ${reason}`)
        message.edit({ content: `Application was __**DENIED**__ by <@${interaction.user.id}>\n\n## __Notes Given:__\n${reason}`, components: [] }).catch(console.error);

        // create embed to the channel

        const responseEmbed = new Discord.EmbedBuilder()
          .setTitle(`Your Application has been __DENIED__`)
          .setDescription(`## __Notes:__\n${reason}`)
          .setThumbnail(`https://minotar.net/helm/${Username}/180.png`)
          .setColor('#704CF6')
          .setFooter({ text: 'Journalism Club | Application Status' })
        
        responseChannel.send( { content: `<@${applicantID}>`, embeds: [responseEmbed] } );
        
        // send customised embed

        const customEmbed = new Discord.EmbedBuilder()
          .setTitle(`Your Application has been __DENIED__`)
          .setDescription(`Uh oh! It looks like your application was denied, we're sorry to hear, however, this isn't the end of the world, you're free to post your application any time again, new and improved, our leads always provide feedback you can read within the application responses channel in the discord so be sure to check it out!\n\n## Thank you for choosing Journalism!`)
          .setColor('#704CF6')
          .setThumbnail(`https://minotar.net/helm/Customable/180.png`)
          .setFooter({ text: 'Journalism Club | Application Automation' })
      
        client.users.fetch(applicantID).then((user) => user.send( { embeds: [customEmbed] } ));

      });

      collector.on('end', collected => {
        if (collected.size === 0) {
          interaction.followUp({ content: '## Application Response\n> No reason provided. Action canceled.', ephemeral: true });
        }
      });
    })
    .catch(error => {
      console.error('Error fetching message:', error);
    });

    //
    // End of Deny
    //

  }

});


//
//
// NEW REQUEST COMMAND
//
//

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'request') {

    const requestmodal = new Discord.ModalBuilder()
      .setTitle(`Club Request`)
      .setCustomId('clubrequest')

    const username = new Discord.TextInputBuilder()
      .setCustomId('username')
      .setMinLength(3)
      .setMaxLength(16)
      .setPlaceholder('e.g. Customable')
      .setRequired(true)
      .setLabel('What is your username?')
      .setStyle(TextInputStyle.Short)

    const request = new Discord.TextInputBuilder()
      .setCustomId('request')
      .setMinLength(8)
      .setMaxLength(100)
      .setPlaceholder('Access to the club house...')
      .setRequired(true)
      .setLabel('What are you requesting?')
      .setStyle(TextInputStyle.Short)

    const notes = new Discord.TextInputBuilder()
      .setCustomId('notes')
      .setMinLength(10)
      .setMaxLength(200)
      .setRequired(false)
      .setLabel('Any additional notes?')
      .setStyle(TextInputStyle.Paragraph)
    
    const modalUsername = new ActionRowBuilder().addComponents(username)
    const modalRequest = new ActionRowBuilder().addComponents(request)
    const modalNotes = new ActionRowBuilder().addComponents(notes)

    
    requestmodal.addComponents(modalUsername, modalRequest, modalNotes)
    interaction.showModal(requestmodal)

  }

})





client.on('interactionCreate', interaction => {
  
  if (!interaction.isButton()) return;

  const messageId = interaction.message.id;
  const adminID = interaction.user.id;
  const adminRole = `1125223842432946196`;
  
  if (interaction.customId == 'requestaccept') {
    
    //
    // Start of Accepted
    //

    if (!interaction.guild.members.cache.get(adminID).roles.cache.has(adminRole)) {
      interaction.reply({ content: `## Journalism Requests\n> You do not have the permissions to status requests.`, ephemeral: true });

    } else {
      interaction.channel.messages.fetch(messageId)
      .then(async message => {

        const logChannel = client.channels.cache.get('932778175988133918');

        const embedTitle = message.embeds[0].title;
        const embedDescription = message.embeds[0].description;
        const requested = message.embeds[0].fields[0].value;
        const applicantID = embedDescription.toString().replace('[', '').replace(']', '');

        console.log(`[JOURNALISM] ${interaction.user.tag} has ACCEPTED ${embedTitle} for: ${requested}`)
        logChannel.send({ content: `## Journalism Requests\n> <@${interaction.user.id}> has accepted <@${applicantID}>'s request for: \`\`${requested}\`\`` });

        interaction.reply({ content: `## Journalism Requests\n> You have accepted <@${applicantID}>'s request for: \`\`${requested}\`\``, ephemeral: true });

        client.users.fetch(applicantID).then((user) => user.send( { content: `## Journalism Requests\n> Your request for \`\`${requested}\`\` was **Accepted** by <@${interaction.user.id}>` } ));

        message.delete();
      });
    }

    //
    // End of Accepted
    //

  } else if (interaction.customId == 'requestreject') {
    
    //
    // Start of Reject
    //

    if (!interaction.guild.members.cache.get(adminID).roles.cache.has(adminRole)) {
      interaction.reply({ content: `## Journalism Requests\n> You do not have the permissions to status requests.`, ephemeral: true });

    } else {
      interaction.channel.messages.fetch(messageId)
      .then(async message => {

        const logChannel = client.channels.cache.get('932778175988133918');

        const embedTitle = message.embeds[0].title;
        const embedDescription = message.embeds[0].description;
        const requested = message.embeds[0].fields[0].value;
        const applicantID = embedDescription.toString().replace('[', '').replace(']', '');

        console.log(`[JOURNALISM] ${interaction.user.tag} has REJECTED ${embedTitle} for: ${requested}`)
        logChannel.send({ content: `## Journalism Requests\n> <@${interaction.user.id}> has rejected <@${applicantID}>'s request for: \`\`${requested}\`\`` });

        interaction.reply({ content: `## Journalism Requests\n> You have rejected <@${applicantID}>'s request for: \`\`${requested}\`\``, ephemeral: true });

        client.users.fetch(applicantID).then((user) => user.send( { content: `## Journalism Requests\n> Your request for \`\`${requested}\`\` was **Rejected** by <@${interaction.user.id}>` } ));

        message.delete();
      });
    }

    //
    // End of Reject
    //

  }

});

// WELCOME MESSAGE
// WELCOME MESSAGE
// WELCOME MESSAGE

client.on('guildMemberAdd', member => {
  member.roles.add(member.guild.roles.cache.find(i => i.name === 'MEMBERS | CITIZENS OF KARAKURA'))
  member.roles.add(member.guild.roles.cache.find(i => i.name === '[BP] broadcast ping'))

  const avatarURL = member.displayAvatarURL({ format: 'png', dynamic: true, size: 256 });

  const welcomeEmbed = new Discord.EmbedBuilder()
    .setColor('#704CF6')
    .setTitle(` `)
    .setDescription(`## Welcome to the **Journalism Club**\n \nWe're your **number one** and only news source reporting on the happenings of **Karakura High and Community College**.\n \n> Whilst you're here, check out our journalists amazing reports in <#786344568815091782> or perhaps consider applying with our custom application response system with the information under <#802352763136770088>, we're always on the look out for new journalists and if you believe you have the potential to inform, we encourage you to try your luck, worst you'll get is a lot of feedback!\n \n> You can view our **Rosters** under <#561674692239294485> to see when slots are open are applications are potentially near reviewal!\n \nWe hope you enjoy your stay and our reports!\n \n### Thank you for choosing Journalism!`)
    .setThumbnail(avatarURL)

  const welcomeChannel = client.channels.cache.get('710233948705390673');

  welcomeChannel.send( { content: `<@${member.id}>`, embeds: [welcomeEmbed] } );
  welcomeChannel.send(`https://imgur.com/a/NJNecaC`)
})

// RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM
// RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM
// RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM
// RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM
// RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM


//
// Presets
//

const radioChannel = '1206734391305441421';
const speakerChannel = '1206734439804174396';  
const speakerRole = '1206733971208151110';
const pingRole = '1206735400240939049';
const bannerEmojis = '<:cl1:1205262248860196935><:cl2:1205262250072350761><:cl3:1205262251628695662><:cl4:1205262252907954257> <:jr1:1205262182388867162><:jr2:1205262183944945684><:jr3:1205262186088239114><:jr4:1205262193847832626><:jr5:1205262203297726474><:jr6:1205262204459290655><:jr7:1205262205919174736>';
const bannerSupport = '<:sp1:1207489948169543781><:sp2:1207489949998514227><:sp3:1207489951260999751><:sp4:1207489952561234010><:sp5:1207489953815068672>';
const boosterRole = '1116796097550090271';
const questionChannel = '1207486588292960337';
const radioWebhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1387991883363385485/SOtEfSt1ph0KdTX48uQjXwLtAk7sjgOdRDWUih2HsqVpwGGJuHxDpQQHJZ90Wk3ezAy6' });



//
// Start
//

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'radio-start') {
    const radio = require('./radio.json');
    const hostID = interaction.user.id;
    const hostRole = speakerRole;

    if (!interaction.guild.members.cache.get(hostID).roles.cache.has(hostRole)) {
      interaction.reply( { content: `You have no permission to do this`, ephemeral: true } );
    } else if (radio.online === true) {
      interaction.reply( { content: "The broadcast is already online!", ephemeral: true } )
    } else {

      const radio = require('./radio.json');

      radio.online = true;

      fs.writeFile('./radio.json', JSON.stringify(radio, null, 4), (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }
        console.log('The Broadcast was started');
      });

      //
      // Announcement
      //

      const broadcastChannel = client.channels.cache.get(radioChannel);
      const microphoneChannel = client.channels.cache.get(speakerChannel);

      const StartEmbed = new Discord.EmbedBuilder()
        .setTitle(` `)
        .setDescription(`## ${bannerEmojis}\n \nThe **Journalism Club Radio Broadcast** is starting, tune in to hear the latest from todays hosts!`)
        .setColor('#704CF6')
        .setFooter({ text: 'Journalism Club | Broadcast' })

      broadcastChannel.send({ content: `<@&${pingRole}>`, embeds: [StartEmbed] })

      const confirmationEmbed = new Discord.EmbedBuilder()
        .setTitle(` `)
        .setDescription(`## ${bannerEmojis}\n \n:red_circle: You're now live!`)
        .setColor('#704CF6')
        .setFooter({ text: 'Journalism Club | Broadcast' })
      
      microphoneChannel.send({ embeds: [confirmationEmbed] })

      broadcastChannel.setName("🔴radio")

      //
      // Webhook
      //

      radioWebhook.send({
        username: 'Journalism Radio',
        avatarURL: 'https://i.imgur.com/BrHNLdB.png',
        embeds: [StartEmbed],
      });

      //
      // Webhook
      //

      await interaction.reply( {content: "🔴 The Broadcast was started", ephemeral: true } )

    }

  }

})


//
// Stop
//

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'radio-stop') {
    const radio = require('./radio.json');
    const hostID = interaction.user.id;
    const hostRole = speakerRole;

    if (!interaction.guild.members.cache.get(hostID).roles.cache.has(hostRole)) {
      interaction.reply( { content: `You have no permission to do this`, ephemeral: true } );
    } else if (radio.online === false) {
      interaction.reply( { content: "The broadcast is already offline!", ephemeral: true } )
    } else {

      const radio = require('./radio.json');

      radio.online = false;

      fs.writeFile('./radio.json', JSON.stringify(radio, null, 4), (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }
        console.log('The Broadcast was ended');
      });

      //
      // Announcement
      //

      const broadcastChannel = client.channels.cache.get(radioChannel);
      const microphoneChannel = client.channels.cache.get(speakerChannel);

      const EndingEmbed = new Discord.EmbedBuilder()
        .setTitle(` `)
        .setDescription(`## ${bannerEmojis}\n \nThe **Journalism Club Radio Broadcast** is ending, tune in another time to hear the latest from the hosts!`)
        .setColor('#704CF6')
        .setFooter({ text: 'Journalism Club | Broadcast' })

      broadcastChannel.send({ embeds: [EndingEmbed] })

      //Actionrow

      const rowAction = new Discord.ActionRowBuilder({
        components: [
          {
            custom_id: `golive`,
            label: `Go Live`,
            style: ButtonStyle.Success,
            type: Discord.ComponentType.Button,
            emoji: `🔴`,
          },
        ],
      })

      const ConfirmationEmbed = new Discord.EmbedBuilder()
        .setTitle(` `)
        .setDescription(`## ${bannerEmojis}\n \n:black_circle: You are no longer on the air!`)
        .setColor('#704CF6')
        .setFooter({ text: 'Journalism Club | Broadcast' })
      
      microphoneChannel.send({ embeds: [ConfirmationEmbed], components: [rowAction] })

      broadcastChannel.setName("⚫radio")

      //
      // Webhook
      //

      radioWebhook.send({
        username: 'Journalism Radio',
        avatarURL: 'https://i.imgur.com/BrHNLdB.png',
        embeds: [EndingEmbed],
      });

      //
      // Webhook
      //

      await interaction.reply( {content: "⚫ The Broadcast was stopped", ephemeral: true } )

    }

  }

});

//
// Role react
//

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'react-setup') {

    //Actionrow

    const rowAction = new Discord.ActionRowBuilder({
      components: [
        {
          custom_id: `BroadcastRole`,
          label: `Radio Ping`,
          style: ButtonStyle.Primary,
          type: Discord.ComponentType.Button,
          emoji: `🎙️`,
        },
      ],
    })

    const reactionEmbed = new Discord.EmbedBuilder()
      .setTitle(` `)
      .setDescription(`## ${bannerEmojis}\n \nReact with the roles you'd like to add or remove!`)
      .setColor('#704CF6')
      .setFooter({ text: 'Journalism Club | Role Reaction' })
      
    interaction.channel.send({ embeds: [reactionEmbed], components: [rowAction] })

    await interaction.reply( {content: "Posted React Message", ephemeral: true } )

  }

});

//
// Button await
//

client.on('interactionCreate', async interaction => {

  if (!interaction.isButton()) return;
    
  if (interaction.customId === 'golive') {
    const hostID = interaction.user.id;
    const hostRole = speakerRole;

    if (!interaction.guild.members.cache.get(hostID).roles.cache.has(hostRole)) {
      interaction.reply( { content: `You have no permission to do this`, ephemeral: true } );
      return;
    }

    const radio = require('./radio.json');

    radio.online = true;

    fs.writeFile('./radio.json', JSON.stringify(radio, null, 4), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('The Broadcast was started');
    });

      //
      // Announcement
      //

    const broadcastChannel = client.channels.cache.get(radioChannel);
    const microphoneChannel = client.channels.cache.get(speakerChannel);

    const StartEmbed = new Discord.EmbedBuilder()
      .setTitle(` `)
      .setDescription(`## ${bannerEmojis}\n \nThe **Journalism Club Radio Broadcast** is starting, tune in to hear the latest from todays hosts!`)
      .setColor('#704CF6')
      .setFooter({ text: 'Journalism Club | Broadcast' })

    broadcastChannel.send({ content: `<@&${pingRole}>`, embeds: [StartEmbed] })

    const confirmationEmbed = new Discord.EmbedBuilder()
      .setTitle(` `)
      .setDescription(`## ${bannerEmojis}\n \n:red_circle: You're now live!`)
      .setColor('#704CF6')
      .setFooter({ text: 'Journalism Club | Broadcast' })
      
    microphoneChannel.send({ embeds: [confirmationEmbed] })

    broadcastChannel.setName("🔴radio")

    //
    // Webhook
    //

    radioWebhook.send({
      username: 'Journalism Radio',
      avatarURL: 'https://i.imgur.com/BrHNLdB.png',
      embeds: [StartEmbed],
    });

    //
    // Webhook
    //

    //
    // remove buttons
    //

    //
    // remove buttons
    //

    const messageId = interaction.message.id;

    interaction.channel.messages.fetch(messageId)
    .then(async message => {
      message.edit( { components: [] } );
    })
  } else if (interaction.customId === 'BroadcastRole') {

    const hostID = interaction.user.id;
    const pingingRole = pingRole;

    if (!interaction.guild.members.cache.get(hostID).roles.cache.has(pingingRole)) {

      interaction.guild.members.cache.get(hostID).roles.add(interaction.guild.roles.cache.find(i => i.name === '[BP] broadcast ping'))
      interaction.reply( { content: `You will now be notified when a broadcast is starting!`, ephemeral: true } );

    } else {
      interaction.guild.members.cache.get(hostID).roles.remove(interaction.guild.roles.cache.find(i => i.name === '[BP] broadcast ping'))
      interaction.reply( { content: `You will no longer be notified when a broadcast is starting!`, ephemeral: true } );

    }
  }
});


//
// Radio Action
//


client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'radio-action') {
    const radio = require('./radio.json');
    const hostID = interaction.user.id;
    const hostRole = speakerRole;

    if (!interaction.guild.members.cache.get(hostID).roles.cache.has(hostRole)) {
      interaction.reply( { content: `You have no permission to do this`, ephemeral: true } );
    } else if (radio.online === false) {
      interaction.reply( { content: "The broadcast is offline!", ephemeral: true } )
    } else {
      const broadcastChannel = client.channels.cache.get(radioChannel);
      const action = interaction.options.get('input')?.value.toString();

      const ActionEmbed = new Discord.EmbedBuilder()
        .setTitle(` `)
        .setDescription(`**${action}**`)
        .setColor(`#2B2D31`)

      broadcastChannel.send( { embeds: [ActionEmbed] } )

      interaction.channel.send( { embeds: [ActionEmbed] } )

      //
      // Webhook
      //

      radioWebhook.send({
        username: 'Journalism Radio',
        avatarURL: 'https://i.imgur.com/BrHNLdB.png',
        embeds: [ActionEmbed],
      });

      //
      // Webhook
      //

      interaction.reply( { content: "Your action was sent", ephemeral: true } )
    }
  }

});


//
// Channel Check
//

client.on('messageCreate', (message) => {
  const radio = require('./radio.json');

  const inputChannel = speakerChannel;
  
  
  if (message.author.id !== `1115314007113478205` && radio.online && message.channel.id === inputChannel) {
    // Send to broadcast channel
  
    const hostID = message.author.id; 
    const hostRole = speakerRole;

    if (!message.guild.members.cache.get(hostID).roles.cache.has(hostRole)) {
      message.delete();
    } else {
      const broadcastChannel = client.channels.cache.get(radioChannel);

      const dnickname = message.member.nickname;

      if (!dnickname) {
        message.reply( { content: `Please set your nickname \n \n Username | RPname`, ephemeral: true } )
        return;
      }

      const [name1, rpname] = dnickname.split('|').map(name => name.trim());
      const username = name1.replace(" ", "");


      const CharacterEmbed = new Discord.EmbedBuilder()
        .setTitle(` `)
        .setDescription(`"${message}"`)
        .setColor(`#2B2D31`)
        .setAuthor( { name: rpname + " says,", iconURL: `https://minotar.net/helm/${username}/180.png` } )

      broadcastChannel.send( { embeds: [CharacterEmbed] } );

      //
      // Webhook
      //

      radioWebhook.send({
        content: `"${message}"`,
        username: `${rpname}`,
        avatarURL: `https://minotar.net/helm/${username}/180.png`,
      });

      //
      // Webhook
      //
    }
  } else if (message.author.id !== `1115314007113478205` && radio.online === false && message.channel.id === inputChannel) {
    message.delete();
  }
});

// QUESTION QUESTION
// QUESTION QUESTION
// QUESTION QUESTION

//
// Question
//

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ask-radio') {
    const radio = require('./radio.json');
    const hostID = interaction.user.id;
    const neededRole = boosterRole;

    if (radio.booster === true) {
      if (!interaction.guild.members.cache.get(hostID).roles.cache.has(neededRole)) {
        interaction.reply( { content: `## ${bannerSupport}\nSorry for the inconvenience, this command is in supporters only setting currently!\n> Consider boosting the server to become a supporter!`, ephemeral: true } )
      } else {
        const questionModal = new Discord.ModalBuilder()
          .setTitle(`Ask the radio a question!`)
          .setCustomId(`questionmodal`)
        const username = new Discord.TextInputBuilder()
          .setCustomId(`username`)
          .setMinLength(3)
          .setMaxLength(16)
          .setPlaceholder(`Customable...`)
          .setRequired(true)
          .setLabel(`Whats your username?`)
          .setStyle(TextInputStyle.Short)
        const rpname = new Discord.TextInputBuilder()
          .setCustomId(`rpname`)
          .setMinLength(3)
          .setMaxLength(30)
          .setPlaceholder(`Mee-young...`)
          .setRequired(true)
          .setLabel(`Whats your RPname?`)
          .setStyle(TextInputStyle.Short)
        const question = new Discord.TextInputBuilder()
          .setCustomId(`question`)
          .setMinLength(10)
          .setMaxLength(200)
          .setPlaceholder(`...`)
          .setRequired(true)
          .setLabel(`Whats your question?`)
          .setStyle(TextInputStyle.Paragraph)

        const modalUsername = new ActionRowBuilder().addComponents(username)
        const modalRPname = new ActionRowBuilder().addComponents(rpname)
        const modalQuestion = new ActionRowBuilder().addComponents(question)
      
        questionModal.addComponents(modalUsername, modalRPname, modalQuestion)
        interaction.showModal(questionModal)
      }
    } else {
      const questionModal = new Discord.ModalBuilder()
        .setTitle(`Ask the radio a question!`)
        .setCustomId(`questionmodal`)
      const username = new Discord.TextInputBuilder()
        .setCustomId(`username`)
        .setMinLength(3)
        .setMaxLength(16)
        .setPlaceholder(`Customable...`)
        .setRequired(true)
        .setLabel(`Whats your username?`)
        .setStyle(TextInputStyle.Short)
      const rpname = new Discord.TextInputBuilder()
        .setCustomId(`rpname`)
        .setMinLength(3)
        .setMaxLength(30)
        .setPlaceholder(`Mee-young...`)
        .setRequired(true)
        .setLabel(`Whats your RPname?`)
        .setStyle(TextInputStyle.Short)
      const question = new Discord.TextInputBuilder()
        .setCustomId(`question`)
        .setMinLength(10)
        .setMaxLength(200)
        .setPlaceholder(`...`)
        .setRequired(true)
        .setLabel(`Whats your question?`)
        .setStyle(TextInputStyle.Paragraph)

      const modalUsername = new ActionRowBuilder().addComponents(username)
      const modalRPname = new ActionRowBuilder().addComponents(rpname)
      const modalQuestion = new ActionRowBuilder().addComponents(question)
      
      questionModal.addComponents(modalUsername, modalRPname, modalQuestion)
      interaction.showModal(questionModal)
    }

  }

});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'toggle-ask') {
    const radio = require('./radio.json');
    const hostID = interaction.user.id;
    const hostRole = speakerRole;
    
    if (!interaction.guild.members.cache.get(hostID).roles.cache.has(hostRole)) {
      interaction.reply( { content: 'You have no permission to perform this command', ephemeral: true } )
    } else {
      if (radio.booster === true) {

        radio.booster = false;

        fs.writeFile('./radio.json', JSON.stringify(radio, null, 4), (err) => {
          if (err) {
            console.error('Error writing file:', err);
            return;
          }  
        });

        interaction.reply( { content: `Booster requirement for questions has been disabled`, ephemeral: true } )

      } else {

        radio.booster = true;

        fs.writeFile('./radio.json', JSON.stringify(radio, null, 4), (err) => {
          if (err) {
            console.error('Error writing file:', err);
            return;
          }  
        });

        interaction.reply( { content: `Booster requirement for questions has been enabled`, ephemeral: true } )
      }
    }
  }

});

client.on('interactionCreate', async interaction => {

  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === 'questionmodal') {
    try {
      const radio = require('./radio.json');
      const username = interaction.fields.getTextInputValue('username');
      const rpname = interaction.fields.getTextInputValue('rpname');
      const question = interaction.fields.getTextInputValue('question');
  
      const senderID = interaction.user.id;
      const submissionChannel = client.channels.cache.get(questionChannel);
  
      //
      // action row
      //
      const status = new Discord.ActionRowBuilder({
        components: [
          {
            custom_id: `questionaccept`,
            label: `Accept`,
            style: ButtonStyle.Success,
            type: Discord.ComponentType.Button,
          },
          {
            custom_id: `questiondeny`,
            label: `Deny`,
            style: ButtonStyle.Danger,
            type: Discord.ComponentType.Button,
          },
        ],
      })
  
      const questionEmbed = new Discord.EmbedBuilder()
        .setTitle(`${username}'s question`)
        .setDescription(`[${senderID}]`)
        .setFields(
          { name: 'Whats being asked?', value: question },
          { name: 'Discord:', value: `<@${senderID}>`, inline: true },
          { name: 'RPname:', value: rpname, inline: true },
        )
        .setColor('#704CF6')
        .setThumbnail(`https://minotar.net/helm/${username}/180.png`)
        .setFooter({ text: 'Journalism Club | Ask Radio' })
      
      await submissionChannel.send( { embeds: [questionEmbed], components: [status]} );
      if (radio.booster === true) {
        await interaction.reply({ content: `## ${bannerSupport}\nYour question has been submitted!`, ephemeral: true});
      } else {
        await interaction.reply({ content: `## Ask Radio\nYour question has been submitted!`, ephemeral: true});
      }
    } catch (error) {
      console.error("❌ Error handling modal submission:", error);
      if (!interaction.replied) {
        await interaction.reply({ content: "An error occurred while submitting your question.", ephemeral: true });
      }
    }
  }
});

client.on('interactionCreate', interaction => {
  
  if (!interaction.isButton()) return;

  const messageId = interaction.message.id;
  
  if (interaction.customId == 'questionaccept') {
    
    //
    // Start of Question Accepted
    //

    const hostID = interaction.user.id;
    const hostRole = speakerRole;
    
    if (!interaction.guild.members.cache.get(hostID).roles.cache.has(hostRole)) {
      interaction.reply( { content: 'You have no permission to do this', ephemeral: true } )
      return;
    } 

    interaction.channel.messages.fetch(messageId)
    .then(async message => {

      const embedDescription = message.embeds[0].description;
      const question = message.embeds[0].fields[0].value;
      const applicantID = embedDescription.toString().replace('[', '').replace(']', '');

      client.users.fetch(applicantID).then((user) => user.send( { content: `## Ask Radio\n> Your question: \`\`${question}\`\` was **Accepted**!` } ));
      message.edit( { content: `Accepted by host <@${interaction.user.id}>`, components: [] } )
    })
    .catch(error => {
      console.error('Error fetching message:', error);
    });

  } else if (interaction.customId == 'questiondeny') {

    //
    // Start of Question Deny
    //

    const hostID = interaction.user.id;
    const hostRole = speakerRole;
    
    if (!interaction.guild.members.cache.get(hostID).roles.cache.has(hostRole)) {
      interaction.reply( { content: 'You have no permission to do this', ephemeral: true } )
      return;
    } 

    interaction.channel.messages.fetch(messageId)
    .then(async message => {

      const embedDescription = message.embeds[0].description;
      const question = message.embeds[0].fields[0].value;
      const applicantID = embedDescription.toString().replace('[', '').replace(']', '');

      client.users.fetch(applicantID).then((user) => user.send( { content: `## Ask Radio\n> Your question: \`\`${question}\`\` was **Denied**` } ));
      message.edit( { content: `Denied by host <@${interaction.user.id}>`, components: [] } )
    })
    .catch(error => {
      console.error('Error fetching message:', error);
    });

  }
});



// RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM
// RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM
// RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM
// RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM
// RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM RADIO SYSTEM

// Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar
// Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar
// Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar
// Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar
// Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar

const polls = require('./polls.json');
const suggestionsChannelId = `1209687612483436544`;
const administratorRole = `590712665110872077`;

const eb = [`<:oeb1:1209824242477178900>`, `<:oeb2:1209824243777536021>`, `<:oeb3:1209824245031501894>`];
const fb = [`<:ofb1:1209824245975093291>`, `<:ofb2:1209824247854268466>`, `<:ofb3:1209824249456492544> `];

const ceb = [`<:ceb1:1209824325100642344>`, `<:ceb2:1209824326799331328>`, `<:ceb3:1209824328846155786>`];
const cfb = [`<:cfb1:1209824330175881246>`, `<:cfb2:1209824331811786762>`, `<:cfb3:1209824333497901066>`];

function barProgress(up, down, state) {
    let total = (up + down);
  
    let percent = Math.floor((up / total) * 10);
  
    let progressBar = ``;

    if (state === true) { 
      for (let i = 0; i < 10; i++) {
        if (i === 0) {
            progressBar += percent > 0 ? fb[0] : eb[0];
        } else if (i === 9) {
            progressBar += percent === 10 ? fb[2] : eb[2];
        } else if (i < percent) {
            progressBar += fb[1];
        } else {
            progressBar += eb[1];
        }
      }
    } else if (state === false) {
      for (let i = 0; i < 10; i++) {
        if (i === 0) {
            progressBar += percent > 0 ? cfb[0] : ceb[0];
        } else if (i === 9) {
            progressBar += percent === 10 ? cfb[2] : ceb[2];
        } else if (i < percent) {
            progressBar += cfb[1];
        } else {
            progressBar += ceb[1];
        }
      }
    } else {
      return "Error catching bar state";
    }

    return progressBar;

}


client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'create-suggestion') {

    const pollModal = new Discord.ModalBuilder()
      .setTitle(`Create a poll`)
      .setCustomId(`pollModal`)
    const title = new Discord.TextInputBuilder()
      .setCustomId(`title`)
      .setMinLength(3)
      .setMaxLength(40)
      .setPlaceholder(`I think it would be cool if...`)
      .setRequired(true)
      .setLabel(`Whats your suggestion's title?`)
      .setStyle(TextInputStyle.Short)
    const description = new Discord.TextInputBuilder()
      .setCustomId(`description`)
      .setMinLength(10)
      .setMaxLength(1000)
      .setPlaceholder(`...`)
      .setRequired(true)
      .setLabel(`Explain the suggestion further`)
      .setStyle(TextInputStyle.Paragraph)

    const modalTitle = new ActionRowBuilder().addComponents(title)
    const modalDescription = new ActionRowBuilder().addComponents(description)
      
    pollModal.addComponents(modalTitle, modalDescription)
    interaction.showModal(pollModal)

  }

})

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'close-suggestion') {

    if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(administratorRole)) {
      interaction.reply( { content: `You have no permission to do this`, ephemeral: true } );
      return;
    }

    const pollID = interaction.options.get('messageid')?.value.toString();

    if (!Array.isArray(polls[pollID])) {
      interaction.reply( {content: "This message id isn't a valid suggestion!", ephemeral: true } )
      return;

    } else if (polls[pollID].includes("Closed")) {
      interaction.reply( { content: "This suggestion is already closed!", ephemeral: true } )
      return;

    } else {
      polls[pollID].push("Closed");

      fs.writeFile('./polls.json', JSON.stringify(polls, null, 4), (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }  
      });


      interaction.channel.messages.fetch(pollID)
      .then(async message => {

        const title = message.embeds[0].title;
        const description = message.embeds[0].description;
        const author = message.embeds[0].author.name;
        const authorURL = message.embeds[0].author.iconURL;
      
        const upvotes = parseInt(message.embeds[0].fields[0].value);
        const downvotes = parseInt(message.embeds[0].fields[1].value);

        const pollNewEmbed = new Discord.EmbedBuilder()
          .setTitle(title)
          .setDescription(description)
          .setFields(
            { name: ':arrow_up: Upvotes', value: `${upvotes}`, inline: true },
            { name: ':arrow_down: Downvotes', value: `${downvotes}`, inline: true },
            { name: ' ', value: barProgress(upvotes, downvotes, false)},
          )
          .setColor('#FF5555')
          .setFooter({ text: 'Journalism Club | Suggestion' })
          .setAuthor( {name: author, iconURL: authorURL} )

        message.edit( {embeds: [pollNewEmbed], components: [] } )

        interaction.reply( { content: "Closing the **" + title + "** suggestion!", ephemeral: true } )

      });
    }

  }
});


client.on('interactionCreate', async interaction => {

  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === 'pollModal') {
    const title = interaction.fields.getTextInputValue('title');
    const description = interaction.fields.getTextInputValue('description');

    //
    // action row
    //
    const status = new Discord.ActionRowBuilder({
      components: [
        {
          custom_id: `upvote`,
          label: `Upvote`,
          style: ButtonStyle.Success,
          type: Discord.ComponentType.Button,
        },
        {
          custom_id: `downvote`,
          label: `Downvote`,
          style: ButtonStyle.Danger,
          type: Discord.ComponentType.Button,
        },
      ],
    })

    const submitter = interaction.guild.members.cache.get(interaction.user.id)

    const pollEmbed = new Discord.EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setFields(
        { name: ':arrow_up: Upvotes', value: `0`, inline: true  },
        { name: ':arrow_down: Downvotes', value: `0`, inline: true },
        { name: ' ', value: barProgress(0, 0, true)},
      )
      .setColor('#7FFFD4')
      .setFooter({ text: 'Journalism Club | Suggestion' })
      .setAuthor( {name: submitter.displayName, iconURL: submitter.displayAvatarURL({ format: 'png', dynamic: true, size: 256 })} )
    
    const suggestionsChannel = client.channels.cache.get(suggestionsChannelId);

    const sentMessage = await suggestionsChannel.send( { embeds: [pollEmbed], components: [status]} );

    const messageID = sentMessage.id;
    
    if (!Array.isArray(polls[messageID])) {
      polls[messageID] = [];
    }

    polls[messageID].push(title);

    polls[messageID].push("1205191289147105291");

    fs.writeFile('./polls.json', JSON.stringify(polls, null, 4), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }  
    });

    interaction.reply({ content: `Your suggestion has been submitted!`, ephemeral: true } );
  }
});



client.on('interactionCreate', interaction => {
  
  if (!interaction.isButton()) return;

  const messageID = interaction.message.id;
  const hostID = interaction.user.id;
  
  if (interaction.customId == 'upvote') {

    //check

    if (polls[messageID].includes(hostID)) {
      interaction.reply( { content: "You have already casted a vote!", ephemeral: true } )
      return;

    } else if (polls[messageID].includes("Closed")) {
      interaction.reply( { content: "This suggestion is closed!", ephemeral: true } )
      return;
    }
    
    //
    // upvote
    //


    interaction.channel.messages.fetch(messageID)
    .then(async message => {

      const title = message.embeds[0].title;
      const description = message.embeds[0].description;
      const author = message.embeds[0].author.name;
      const authorURL = message.embeds[0].author.iconURL;
      
      const upvotes = parseInt(message.embeds[0].fields[0].value) + 1;
      const downvotes = parseInt(message.embeds[0].fields[1].value);

      const pollNewEmbed = new Discord.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setFields(
          { name: ':arrow_up: Upvotes', value: `${upvotes}`, inline: true },
          { name: ':arrow_down: Downvotes', value: `${downvotes}`, inline: true },
          { name: ' ', value: barProgress(upvotes, downvotes, true)},
        )
        .setColor('#7FFFD4')
        .setFooter({ text: 'Journalism Club | Suggestion' })
        .setAuthor( {name: author, iconURL: authorURL} )

      message.edit( { embeds: [pollNewEmbed] } );

      polls[messageID].push(hostID);

      fs.writeFile('./polls.json', JSON.stringify(polls, null, 4), (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }  
      });

    });

    interaction.reply( {content: `You have cast your upvote!`, ephemeral: true } )

  } else if (interaction.customId == 'downvote') {
    

    //check

    if (polls[messageID].includes(hostID)) {
      interaction.reply( { content: "You have already casted a vote!", ephemeral: true } )
      return;

    } else if (polls[messageID].includes("Closed")) {
      interaction.reply( { content: "This suggestion is closed!", ephemeral: true } )
      return;
    }
    
    //
    // downvote
    //


    interaction.channel.messages.fetch(messageID)
    .then(async message => {

      const title = message.embeds[0].title;
      const description = message.embeds[0].description;
      const author = message.embeds[0].author.name;
      const authorURL = message.embeds[0].author.iconURL;
      
      const upvotes = parseInt(message.embeds[0].fields[0].value);
      const downvotes = parseInt(message.embeds[0].fields[1].value) + 1;

      const pollNewEmbed = new Discord.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setFields(
          { name: ':arrow_up: Upvotes', value: `${upvotes}`, inline: true },
          { name: ':arrow_down: Downvotes', value: `${downvotes}`, inline: true },
          { name: ' ', value: barProgress(upvotes, downvotes, true)},
        )
        .setColor('#7FFFD4')
        .setFooter({ text: 'Journalism Club | Suggestion' })
        .setAuthor( {name: author, iconURL: authorURL} )

      message.edit( { embeds: [pollNewEmbed] } );
      
      polls[messageID].push(hostID);

      fs.writeFile('./polls.json', JSON.stringify(polls, null, 4), (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }  
      });

    });

    interaction.reply( {content: `You have cast your downvote!`, ephemeral: true } )

  }
});

client.login(process.env.TOKEN);