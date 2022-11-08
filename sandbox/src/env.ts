import { config } from 'dotenv'
import { join } from 'path'
import { table } from 'table'
import { bold } from 'cli-color'

const { parsed } = config({
  encoding: 'utf-8',
  path: join(__dirname, '../.env.local')
})

console.clear()

if (parsed) {
  console.log(
    table(Object.entries<string>(parsed), {
      header: {
        alignment: 'center',
        content: bold.blue('ENVIRONMENT VARIABLES (DEVELOPMENT)')
      }
    })
  )
}
