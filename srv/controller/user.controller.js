const db = require('../db.js')
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

class UserController {
    async createUser(req, res) {
        const { educationID, roleID, login, email, password, academicDegree, phone, position, full_name, workExperience, workplace} = req.query
        
        password = 'abc'
        const hash_password = hashPassword(password)
        console.log('ХЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭЭШ' + hash_password)

        const newAccount = await db.query(
            `Insert Into account (educationID, roleID, login, email, password, academicDegree, phone, position, full_name, workExperience, workplace) Values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [educationID, roleID, login, email, hash_password, academicDegree, phone, position, full_name, workExperience, workplace]
        );
        res.json(newAccount.rows[0])
    }
    async getUsers(req, res) {

    }
    async getOneUserOnEmail(req, res) {
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
    async deleteUser(req, res) {

    }
    async getOneUserOnEmail(req, res) {
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
    async deleteUser(req, res) {

    }    async getOneUserOnLogin(req, res) {
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
    async deleteUser(req, res) {

    }
    async getOneUserOnPhone(req, res) {
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
    async deleteUser(req, res) {

    }
}

module.exports = new UserController()