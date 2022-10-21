import { config } from 'dotenv'
import { join } from 'path'
import { readdirSync } from 'fs'
import { table } from 'table'
import clc from 'cli-color'

const files = readdirSync(join(__dirname, '..'), { encoding: 'utf-8' })
const data: Array<string>[] = []

for (const file of files) {
  if (!file.startsWith('.env')) continue
  const path = join(__dirname, '..', file)
  const { parsed } = config({
    encoding: 'utf-8',
    path
  })
  for (const key in parsed) {
    if (key === 'NODE_ENV' && parsed[key]) {
      if (parsed[key] !== 'development') {
        throw new Error('Only allowed for development')
      }
    }
    data.push([key, parsed[key]])
  }
}
console.clear()
console.log(table(data, {
  header: {
    alignment: 'center',
    content: clc.bold.blue('ENVIRONMENT VARIABLES (DEVELOPMENT)')
  }
}))