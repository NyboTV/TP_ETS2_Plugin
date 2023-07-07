const { dialog } = require('electron')

const showDialog = async (type, buttons, message) => {
    return new Promise(async (resolve, reject) => {
        let data = {
            type: type,
            buttons: buttons,
            title: "ETS2 Dashboard",
            message: message
        }
        
        resolve(dialog.showMessageBoxSync(data))
    })
}

    
module.exports = showDialog