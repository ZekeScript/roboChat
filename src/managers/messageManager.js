import fs from 'fs'

export default class MessageManager {
  constructor (path) {
    this.path = path
  }

  async #getMaxId () {
    let maxId = 0
    const msgs = await this.getAll()
    msgs.map((msg) => {
      if (msg.id > maxId) {
        maxId = msg.id
      }
      return maxId
    })
    return maxId
  }

  async createMsg (obj) {
    try {
      const msg = {
        id: await this.#getMaxId() + 1,
        ...obj
      }
      const msgfile = await this.getAll()
      msgfile.push(msg)
      await fs.promises.writeFile(this.path, JSON.stringify(msgfile))
      return msg
    } catch (error) {
      console.log(error)
    }
  }

  async getAll () {
    try {
      if (fs.existsSync(this.path)) {
        const msgs = await fs.promises.readFile(this.path, 'utf8')
        const msgsJS = JSON.parse(msgs)
        return msgsJS
      } else {
        return []
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getById (id) {
    const msgsFile = await this.getAll()
    const msg = msgsFile.find((sms) => sms.id === id)
    if (msg) {
      return msg
    }
    return false
  }

  async updateMsg (obj, id) {
    try {
      const msgsFile = await this.getAll()
      const index = msgsFile.findIndex(msg => msg.id === id)
      if (index === -1) {
        throw new Error(`Id ${id} not found`)
      } else {
        msgsFile[index] = { ...obj, id }
      }
      await fs.promises.writeFile(this.path, JSON.stringify(msgsFile))
    } catch (error) {
      console.log(error)
    }
  }

  async deleteMsg (id) {
    const msgsFile = await this.getAll()
    if (msgsFile.length > 0) {
      const newArray = msgsFile.filter(m => m.id !== id)
      await fs.promises.writeFile(this.path, JSON.stringify(newArray))
    } else {
      throw new Error('Msg not found')
    }
  }

  async deleteMsgs () {
    if (fs.promises(this.path)) {
      await fs.promises.unlink(this.path)
    }
  }
}
