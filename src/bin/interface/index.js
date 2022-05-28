$(".driverStates").click(function(e) {
    httpPost("driverStates")
    reload()
});

$(".gameStates").click(function(e) {
    httpPost("gameStates")
    reload()
});

$(".gaugeStates").click(function(e) {
    httpPost("gaugeStates")
    reload()
});

$(".jobStates").click(function(e) {
    httpPost("jobStates")
    reload()
});

$(".navigationStates").click(function(e) {
    httpPost("navigationStates")
    reload()
});

$(".trailerStates").click(function(e) {
    httpPost("trailerStates")
    reload()
});

$(".truckStates").click(function(e) {
    httpPost("truckStates")
    reload()
});

$(".truckersmpStates").click(function(e) {
    httpPost("truckersmpStates")
    alert("It can take up to 2 Minutes, until you see a Change!")
    reload()
});

$(".worldStates").click(function(e) {
    httpPost("worldStates")
    reload()
});




$(".weight").click(function(e) {
    httpPost("weight")
    reload()
}) 

$(".unit").click(function(e) {
    httpPost("unit")
    reload()
}) 
$(".temp").click(function(e) {
    httpPost("temp")
    reload()
}) 



$(".server").click(function(e) {
    httpPost("server")
    reload()
})



$(".home-select").click(async function(e) {
    var position  = ""
    var currency_list = ""
    var currency = ""

    position = document.querySelector('.home-select').selectedIndex
    position = Number(position)
    currency_list = await getJson("currency_list")
    currency = currency_list.currency
    currency_list = currency_list.list

    for( var i = 0; i < currency_list.length; i++){ 
        if ( currency_list[i] === currency) { 
            currency_list.splice(i, 1); 
        }
    }

    currency_list.unshift(currency)
    currency = currency_list[position]
    httpPost("currency", currency)

    if(toReload) {
        reload()
    }
    toReload = true
})

$(".home-select1").click(async function(e) {
    position = document.querySelector('.home-select1').selectedIndex
    position = Number(position-1)

    httpPost("server", position)

    if(toReload) {
        reload()
    }
    toReload = true
})

$(".plugin-status").click(function(e) {
    httpPost("status")
    reload()
})


$(".close").click(function(e) {
    window.close()
})





var error = false
var toReload = false
var settimeout = ""
var countdown = false

function getJson(data) {
    return new Promise(async (resolve, reject) => {
        
        var req = new XMLHttpRequest()

        req.open("POST", "/setup")
        req.setRequestHeader("request", `${data}`)
        req.setRequestHeader("request_data", `currency_list`)

        req.onreadystatechange = function() {
            if(req.status == 401 || req.status == 500) {
                error = true
                alert("Something went Wrong!")
            } else {
                error = false
                var data = req.responseText
                if(IsJsonString(data)) {
                    data = JSON.parse(data)
                    resolve(data)
                }
            }
        }

        req.send(data)
    })
}

function httpPost(data, data2) {

    var req = new XMLHttpRequest()

    req.open("POST", "/setup")
    req.setRequestHeader("request", `${data}`)
    req.setRequestHeader("request_data", `${data2}`)

    req.onreadystatechange = function() {
        if(req.status == 401 || req.status == 500) {
            error = true
            alert("Something went Wrong!")
        } else if(req.status == 201) {
            error = false
        }
    }

    req.send(data)
}


function reload() {
    if(countdown) {
        clearTimeout(settimeout)
        countdown = false
    }
    
    if(!error) {
        timeout()
        countdown = true
    }

    function timeout() {
        settimeout = setTimeout(function(){ window.location.reload()}, 650)
    }
}


setInterval("reload()", 60000)
      
setInterval("reload_div();", 3000)
function reload_div(){
    $('#home-usage').load(' #home_usage')
    $('#Cur-User').load(' #Cur_User')
    $('#test2').load(' #test3')
}


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}