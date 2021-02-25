const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const command = require('./command')
const firstMessage = require('./first-message')
const privateMessage = require('./private-message')
const roleClaim = require('./role-claim')
const poll = require('./poll')
const { MessageEmbed } = require('discord.js')
const memberCount = require('./member-count')
const sendMessage = require('./send-message')
const mongo = require('./mongo')
const welcome = require('./welcome')
const messageCount = require('./message-counter')
const path = require('path')
const fs = require('fs')
const antiAd = require('./anti-ad')
const inviteNotifications = require('./invite-notifications')
// const testSchema = require('@schemas/test-schema')



client.on('ready', async () => {
  console.log('The client is ready!')

  await mongo().then((mongoose) => {
    try {
      console.log('Connected to mongo!')
    } finally {
      mongoose.connection.close()
    }
  })

  firstMessage(client, '813643831672438784', 'hello world!!!', ['🔥', '🍉'])
  privateMessage(client, 'ping', 'Pong!')
  roleClaim(client)
  poll(client)
  memberCount(client)
  welcome(client)
  messageCount(client)
  antiAd(client)
  inviteNotifications(client)

  setInterval(() => {
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    const status = [
      `Server Offline`
      ]
      client.user.setActivity(status[Math.floor(Math.random() * status.length)], {type : "PLAYING"})
    }, 1000)

  const baseFile = 'command-base.js'
  const commandBase = require(`./commands/${baseFile}`)

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file))
        commandBase(client, option)
      }
    }
  }

  readCommands('commands')


  const guild = client.guilds.cache.get('521567953292886016')
  const channel = guild.channels.cache.get('801458796366921800')

  sendMessage(channel, 'hello world', 3)



})

//welcome message
client.on('guildMemberAdd', async(member) => { // this event gets triggered when a new member joins the server!

  const Channel = member.guild.channels.cache.get('597757455426125835')
  const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle(`Member Baru ${member.guild.name} :confetti_ball:`)
      .setDescription(`**${member.displayName}** Selamat Datang di ${member.guild.name}, sekarang kita mempunyai ${member.guild.memberCount} member!`)
  Channel.send(embed)
})
client.on('guildMemberRemove', async(member) => { // this event gets triggered when a new member leaves the server!
  const Channel = member.guild.channels.cache.get('597757455426125835')
  const embed = new MessageEmbed()
      .setColor('RED')
      .setTitle(`Member keluar dari sever ${member.guild.name}`)
      .setDescription(`**${member.displayName}** Telah meninggalkan ${member.guild.name}, sekarang kita ${member.guild.memberCount} member!`)
  Channel.send(embed)
})

client.login(config.token)