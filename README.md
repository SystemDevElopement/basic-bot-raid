# ByResolution Bot - Safe Edition

Bot de Discord basico hecho en discord.js v14, con prefijo `.` enfocado en informacion y utilidades seguras.

> Esta es una version limpia y segura. No incluye funciones de raideo / nuke.

## Como esta construido

**Stack:**
- Node.js + discord.js `v14`
- dotenv para tokens
- Intents: `Guilds`, `GuildMessages`, `MessageContent`

**Estructura principal:**

`index.js` inicia un `Client` y escucha `messageCreate`:
1. Ignora bots
2. Verifica prefijo `.`
3. Separa `comando` y `argumentos`
4. Loguea cada comando con `registro()`

### Comandos incluidos

#### `.botinfo`
Muestra embed con:
- latencia (`client.ws.ping`)
- uptime convertido a dias/horas/minutos/segundos
- version de Node (`process.version`)
- version de discord.js
- uso de memoria heap
- quien pidio el comando

### Sistema de registro

```js
function registro(texto) {
  console.log(`[REGISTRO] ${texto}`);
}
