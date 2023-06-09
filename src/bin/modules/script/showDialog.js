const { dialog } = require('electron')

const showDialog = async (type, buttons, title, message) => {
    return new Promise(async (resolve, reject) => {
        let data = {
            type: type,
            buttons: buttons,
            title: title,
            message: message
        }
        
        resolve(dialog.showMessageBoxSync(data))
    })
}

    
module.exports = showDialog