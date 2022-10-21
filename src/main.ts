import { server } from './server'
import clc from 'cli-color'
import detectPort from 'detect-port'

async function main() {
  const port = await detectPort(parseInt(process.env.PORT || '3000', 10))
  process.env.PORT = port.toString()
  server.listen(port, () => {
    console.log(`${clc.bold.bgGreen(' SERVER ')} http://localhost:${port}/\n`)
  })
}
main()