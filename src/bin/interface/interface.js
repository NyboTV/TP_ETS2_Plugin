$(".gameStates").click(function(e) {
    httpPost("gameStates")
    reload()
});

$(".driverStates").click(function(e) {
    httpPost("driverStates")
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

$(".tmpStates").click(function(e) {
    httpPost("truckersmpStates")
    alert("It can take up to 2 Minutes, until you see a Change!")
    reload()
});

$(".worldStates").click(function(e) {
    httpPost("worldStates")
    reload()
});



$(".currency").click(function(e) {
    httpPost("currency")
    reload()
}) 

$(".weight").click(function(e) {
    httpPost("unit")
    reload()
}) 

$(".unit").click(function(e) {
    httpPost("unit")
    reload()
}) 



$(".server").click(function(e) {
    httpPost("server")
    reload()
})

var error = false

function httpPost(data) {

    var xhr = new XMLHttpRequest()

    xhr.open("POST", "/setup")
    xhr.setRequestHeader("request", `${data}`)

    xhr.onreadystatechange = function() {
        if(xhr.status == 401 || xhr.status == 500) {
            error = true
            alert("Something went Wrong!")
        } else if(xhr.status == 201) {
            error = false
        }
    }

    xhr.send(data)
}


function reload() {
    setTimeout(() => {
        if(!error) 
        window.location.reload()
    }, 550);
}


setInterval("reload()", 60000)
      
setInterval("reload_div();", 3000)
function reload_div(){
    $('#usage').load(' #cur_usage')
    $('#Cur_User').load(' #Cur_User')
}