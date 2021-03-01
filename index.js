const isLocal = false;
//일단 testchannel에서 24시간 구동을 끄려면 ^^;로컬화 한다.
//그 후, isLocal을 true로 하여 로컬에서 돌린다.
//끝나면, 로컬을 끄고, ^^;깃헙화 한다.
//그 후, isLocal을 false로 하여 깃헙에서 돌린다.


const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
const tool = require('./tool');
const fetch = require('node-fetch');
const config = require('./config.json');
const client = new Client({ ws: { intents: Intents.ALL }, partials : ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'] });
const token = config['token'];
const prefix = '^^;';


const Muted = new Array();
const Muteded = new Array();
const me = '703632170341761055';
const testChannel = '815582586880393227';
let botOff = false;

const codeforceIcon = 'https://cdn.discordapp.com/attachments/815582586880393227/815802538162651196/codeforce.png';

client.on('ready', () => {
  console.log('켰다.');
  client.user.setActivity("^^;도움말", { type : 'LISTENING' });
});


client.on('message', async message => {
  if(message.channel.type === 'dm') return;
  if(message.author.bot) return;
  if(!message.content.startsWith(prefix) || message.content === prefix) return;

  if(botOff && message.content === `${prefix}깃헙화` && message.author.id === me && !isLocal) {
    botOff = false;
    return message.channel.send("해당 채널에서도 24시간 봇을 다시 켰습니다.");
  }

  if(botOff && message.channel.id === testChannel) return;

  if(Muted.indexOf(message.author.id) === -1) {
    Muted.push(message.author.id)
    setTimeout(() => Muted.shift(), 1000)
  }
  else if(Muteded.indexOf(message.author.id) === -1) {
    Muteded.push(message.author.id);
    Muted.push(message.author.id);

    setTimeout(() => {
      Muteded.shift();
      Muted.shift();
    }, 1000);

    message.reply("입력속도가 너무 빨라요...좀만 천천히...");
  }
  else {
    Muteded.push(message.author.id);
    Muted.push(message.author.id);

    setTimeout(() => {
      Muteded.shift();
      Muted.shift();
    }, 1000);
  }

  const msg = message.content.slice(prefix.length);
  if(msg.startsWith("도움말") && !isLocal) {
    const query = tool.getQuery(msg);

    if(query === "") {
      const helpImg = 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png';  
      let Embed = new Discord.MessageEmbed()
        .setAuthor('^^;도움말 <명령어 이름>으로 세부사항 확인 가능합니다', helpImg)
        .setColor('#aaddff')
        .setFooter(`쀼삐쀼삐 제작, since 2021.02.28`)
        .addFields(
          { name: "기본 명령어", value: "`도움말`, `핑`", inline: false },
          { name: "코드포스 관련", value: "`코드포스유저`", inline: false },
        )
      return message.channel.send(Embed);
    }
    else {
      const say = [
        {"name": "도움말", "value": "명령어의 사용법을 알려드립니다.", "query": "**<커맨드 이름>**\n\n커맨드 이름:\n> 사용법을 알고 싶은 명령어의 이름입니다.", "example": "**^^;도움말 핑**\n> 명령어 `핑`의 사용법을 알려줍니다."},
        {"name": "핑", "value": "현재 봇의 핑을 알려드립니다.", "query": "(필요 없음)", "example": "**^^;핑**"},
        {"name": "코드포스유저", "value": "코드포스 유저의 정보를 가져옵니다.", "query": "**<유저이름>**\n\n유저이름:\n> 정보를 얻고자 하는 코드포스 유저의 이름입니다.", "example": "**^^;코드포스유저 ()**\n> 코드포스 유저 ()의 정보를 가져옵니다."}
      ];

      let i;
      const len = say.length;

      for(i = 0; i < len; i++) {
        if(query === say[i].name) {
          const helpImg = 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png';  
          let Embed = new Discord.MessageEmbed()
            .setAuthor(`"${say[i].name}" 명령어 사용법`, helpImg)
            .setColor('#aaddff')
            .setFooter(`쀼삐쀼삐 제작, since 2021.02.28`)
            .addFields(
              { name: "기능", value: say[i].value, inline: false },
              { name: "쿼리", value: say[i].query, inline: false },
              { name: "예시", value: say[i].example, inline: false },
            )
          return message.channel.send(Embed);
        }
      }

      if(i == len) {
        return message.reply("그런 명령어는 모릅니다만...");
      }
    }
  }
  else if(msg === '핑' && !isLocal) {
    const m = await message.channel.send("현재 핑: ");
    m.edit(`현재 핑: ${(parseFloat(m.createdTimestamp - message.createdTimestamp)/1000).toFixed(2)}초`);
  }
  else if(!botOff && msg === '로컬화' && message.author.id === me && message.channel.id === testChannel && !isLocal) {
    botOff = true;
    return message.channel.send('해당 채널에서만 24시간 봇을 멈춥니다.');
  }
  else if(msg.startsWith('코드포스유저') && !isLocal) {
    const query = tool.getQuery(msg);
    if(query === "") return message.channel.send("유저이름을 주세요...");

    fetch(`https://codeforces.com/api/user.info?handles=${query}`).then(function(response) {
      return response.json();
    })
    .then(function(result) {
      if(result.status === 'FAILED') {
        return message.channel.send("```\n" + result.comment + "\n```");
      }
      else if(result.status === 'OK') {
        console.log(result.result[0]);
        let color = '';
        if(result.result[0].rank == undefined) {
          result.result[0].rank = '랭크 없음';
          color = '#707070';
        }
        else {
          switch(result.result[0].rank) {
            case 'newbie':
              color = '#707070';
              break;
            case 'pupil':
              color = '#007300';
              break;
            case 'specialist':
              color = '#009EA0';
              break;
            case 'expert':
              color = '#0000FF';
              break;
            case 'candidate master':
              color = '#EC73EC';
              break;
            case 'master':
              color = '#FF9B00';
              break;
            case 'international master':
              color = '#FF9B00';
              break;
            default:
              color = '#FF3434';
              break;
          }
        }

        let names = (result.result[0].firstName == undefined)? '' : result.result[0].firstName;
        names = (result.result[0].lastName == undefined)? names : `${names} ${result.result[0].lastName}`;
        names = (names === "")? "" : `${names} | `
        names = (result.result[0].country == undefined)? `${names}` : `${names} ${result.result[0].country}`;
        names = (result.result[0].city == undefined)? names : `${names}, ${result.result[0].city}`;
        names = (result.result[0].organization == undefined)? names : `${names}\nFrom ${result.result[0].organization}`;

        if(names === "") names = "인적정보 없음";

        let sns = (result.result[0].email == undefined)? "" : result.result[0].email;
        sns = (result.result[0].vkId == undefined)? sns : `${sns}\n${result.result[0].vkId}`;
        sns = (result.result[0].openId == undefined)? sns : `${sns}\n${result.result[0].openId}`;

        if(sns === "") sns = "등록된 SNS정보 없음";

        const contestrating = (result.result[0].rating == undefined)? "기록 없음" : `**${result.result[0].rating}** (최고기록: **${result.result[0].maxRank}, ${result.result[0].maxRating}**)`

        const Embed = new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor(`${result.result[0].handle}`, `https:${result.result[0].avatar}`, `https://codeforces.com/profile/${result.result[0].handle}`)
        .setTitle(`랭크: ${result.result[0].rank}`)
        .setDescription(names)
        .setThumbnail(`https:${result.result[0].titlePhoto}`)
        .addFields(
          { name: 'SNS', value: sns, inline: false },
          { name: 'Contest Rating', value: contestrating, inline: false },
          { name: 'Contribution', value: result.result[0].contribution, inline: false },
          { name: '친구', value: `${result.result[0].friendOfCount}명`, inline: false },
          { name: '마지막 접속으로부터', value: tool.timeAgo(result.result[0].lastOnlineTimeSeconds), inline: false },
          { name: '계정 생성으로부터', value: tool.timeAgo(result.result[0].registrationTimeSeconds), inline: false },
        )

        return message.channel.send(Embed);
      }
    })
    .catch(e => {
      return message.reply("```\n" + e + "\n```");
    });
  }
});


client.login(token);