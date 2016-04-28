var xmlhttp

var interval // global so we can clear it
function time(x){
	if (x < 10){
		return '0'+x
	} else {
		return x
	}
}

function getAndShow(key){
	//key = document.getElementById('key')
	data = document.getElementById('data')
	dataShow = document.getElementById('dataShow')
	keyInfo = document.getElementById('keyInfo')
	document.getElementById('keyName').innerHTML = key
	fullInfo = document.getElementById('fullInfo')
	

	keyInfo.style.display = 'none'
	fullInfo.style.display = ''

    xmlhttp=new XMLHttpRequest()
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            res = JSON.parse(xmlhttp.response)
            data.innerHTML = JSON.stringify(res, 0, 2)
			dataShow.innerHTML = ''
			if (res.with != '404'){
				res.with.forEach(function(e,i,a){
					console.log(e.content)
					console.log(e)
					date = new Date(e.created)
					console.log(date)
					dataShow.innerHTML += '<span class="date">' + 
						time(date.getMonth()+1) + '/' + date.getDate() + '\t' + 
						time(date.getHours()) + ':' + time(date.getMinutes()) + 
						'</span><br /><span class="data">' + JSON.stringify(e.content, 0, 4).replace(/\\"/g, '') +
						'</span><br />'
				})
			} else {
				dataShow.innerHTML += '<span id="error">ERROR NO DATA</span>'
			}
        }
    }
    xmlhttp.open("GET",'https://dweet.io/get/dweets/for/' + key,true)
    xmlhttp.send()
    console.log(xmlhttp)
	setTimeout(function(){
		getAndShow(key)
	}, 10000)
}

function addClickHandler(){
	var arrs = Array.from(document.getElementsByClassName('moreArrow'))
	var rems = Array.from(document.getElementsByClassName('remove'))
	
	arrs.forEach((e,i,a)=>{
		e.onclick = function(){
			getAndShow(this.previousSibling.innerHTML)
		}
	})
	rems.forEach((e,i,a)=>{
		e.onclick = function(){
			KEYS.splice(KEYS.indexOf(e.nextSibling.innerHTML),1)
			chrome.storage.sync.set({'dweetiokeys': KEYS}, function(err){
				console.log(err)
				writeKeyList()
			})
		}
	})
}

function writeKeyList(){
	var main = document.getElementById('main')
	main.innerHTML = ''
	chrome.storage.sync.get('dweetiokeys', function(strg) {
		if (typeof strg.dweetiokeys != 'object') console.log('NOT OBJECT')
		KEYS = strg.dweetiokeys
		KEYS.forEach((e,i,a)=>{
			main.innerHTML += '<img src="remove.png" class="remove"></img><span class="key" style="float:left;">' + e
							+ '</span><span class="moreArrow">&rarr;</span><br />'
		})
		addClickHandler()
		
         // Notify that we saved.
       });
}


document.addEventListener('DOMContentLoaded', function() {
	var back = document.getElementById('back')
	var addBut = document.getElementById('addBut')
	addBut.onclick = function(){
		if (!addBut.previousSibling.value) { // is it empty?
			console.log('empty')
			addBut.previousSibling.style.border = '.01em solid red'
			setTimeout(function(){
				addBut.previousSibling.style.border = ''
			}, 1500)
		} else {
			KEYS.push(addBut.previousSibling.value)
			chrome.storage.sync.set({'dweetiokeys': KEYS}, function(err){
				console.log(err)
			})
			writeKeyList()
		}


	}
	
	back.onclick = function(){
		document.getElementById('dataShow').innerHTML = ''
		back.parentElement.parentElement.style.display = 'none'
		document.getElementById('keyInfo').style.display = ''
	}
	
	writeKeyList()
});