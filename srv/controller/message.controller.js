const db = require('../db.js')

class MessageController {
    async createMessage(req, res) {
        const { name, surname } = req.query
        const newUser = await db.query(
            `Insert Into User (name, surname) Values ($1, $2)`,
            [name, surname]
        );
        res.json(newUser.rows[0])
    }
    async sendMessage(req, res) {

    }
    async deleteMessage(req, res) {
        const { login, password } = req.query
        const oneUser = await db.query(
            `Select *
            From Account
            Where login=$1 And password=$2`,
            [login, password]
        );
        if (oneUser.rowCount > 0)
            res.json('True')
        else
            res.json()
    }
}

module.exports = new MessageController()