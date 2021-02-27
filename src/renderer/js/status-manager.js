function makeStatusElement(){
	var ele = document.createElement("div");
	ele.classList.add("status");
	return ele;
}

function StatusManager(){}

StatusManager.prototype.statusElement = makeStatusElement();

StatusManager.prototype.clearStatusStyle = function(){
	var styles = ["critical", "warning", "success"];
	for (var i = 0; i < styles.length; i++) {
		this.statusElement.classList.remove(styles[i]);
	}
};

StatusManager.prototype.appendIfNotDone = function(){
	var header = document.querySelector("header.main");
	if (header.parentNode != this.statusElement) {
		header.appendChild(this.statusElement);
	}
};

StatusManager.prototype.criticalWarn = function(message){
	this.statusElement.innerHTML = message;
	this.clearStatusStyle();
	this.statusElement.classList.add("critical");
	this.appendIfNotDone();
};

StatusManager.prototype.warn = function(message){
	this.statusElement.innerHTML = message;
	this.clearStatusStyle();
	this.statusElement.classList.add("warning");
	this.appendIfNotDone();
};

StatusManager.prototype.inform = function(message){
	this.statusElement.innerHTML = message;
	this.clearStatusStyle();
	this.appendIfNotDone();
};

StatusManager.prototype.informSuccess = function(message){
	this.statusElement.innerHTML = message;
	this.clearStatusStyle();
	this.statusElement.classList.add("success");
	this.appendIfNotDone();
};