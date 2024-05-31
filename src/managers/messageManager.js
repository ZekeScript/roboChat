import { existsSync, promises } from 'fs'

export default class MessageManager {
  constructor (path) {
    this.path = path
  }

  async #writeMsg (msg) {
    try {
      await promises.writeFile(this.path, JSON.stringify(msg))
    } catch (error) {
      throw new Error(error)
    }
  }

  async #getMaxId () {
    let maxId = 0
    const msgs = await this.getAllMsgs()
    msgs.forEach((msg) => {
      if (msg.id > maxId) {
        maxId = msg.id
      }
    })
    return maxId
  }

  async createMsg (textMsg) {
    try {
      const newMsg = {
        id: await this.#getMaxId() + 1,
        ...textMsg
      }
      const msgList = await this.getAllMsgs()
      const msgFile = [...msgList, newMsg]
      await this.#writeMsg(msgFile)
      return newMsg
    } catch (error) {
      console.log(error)
    }
  }

  async getAllMsgs () {
    try {
      if (existsSync(this.path)) {
        const msgs = JSON.parse(await promises.readFile(this.path, 'utf8'))
        return msgs
      } else {
        return []
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getById (id) {
    try {
      const msgList = await this.getAllMsgs()
      const msgSearched = msgList.find((msg) => msg.id === id)
      if (msgSearched) {
        return msgSearched
      }
      return null
    } catch (error) {
      console.log(error)
    }
  }

  async updateMsg (id, msg) {
    try {
      const msgList = await this.getAllMsgs()
      const msgIndex = msgList.findIndex(m => m.id === id)
      if (msgIndex === -1) {
        throw new Error(`Id ${id} not found`)
      }
      msgList[msgIndex] = { ...msg, id }
      await this.#writeMsg(msgList)
      return msgList[msgIndex]
    } catch (error) {
      console.log(error)
    }
  }

  async deleteMsg (id) {
    try {
      const msgList = await this.getAllMsgs()
      if (msgList.length > 0) {
        const newMsgList = msgList.filter(msg => msg.id !== id)
        await this.#writeMsg(newMsgList)
        return newMsgList
      } else {
        throw new Error('Msg not found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  async deleteMsgs () {
    try {
      if (promises(this.path)) {
        await promises.unlink(this.path)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
