import { PORT } from './configurations'
import { server } from './server'
import { bold } from 'cli-color'
import port from 'detect-port'

async function main() {
  const _port = await port(PORT)
  server.listen(_port, () => {
    console.log(`${bold.bgGreen(' SERVER ')} http://localhost:${_port}/\n`)
  })
}
void main()
