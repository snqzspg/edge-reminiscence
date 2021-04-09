var app = require('electron');

function PGTitleBar(docWindow, hideButtons){
	this.docWindow = docWindow;
	this.doc = docWindow.document;
	this.hideButtons = hideButtons;
	this.scrollPoint = 0;
	this.thickness = 40;
	this.icon_size = 10;
	this.titleBar = document.createElement("div");
	var titleBarCM = PGCM(this.titleBar);
	titleBarCM.add("pg-title-bar");
	if(!hideButtons){
		var buttonsWrapper = document.createElement("div");
		PGCM(buttonsWrapper).add("button-wrapper");
		this.titleBar.appendChild(buttonsWrapper);

		var minimizeButton = document.createElement("button");
		PGCM(minimizeButton).add("min-button");
		minimizeButton.type = "button";
		var x1 = (this.thickness - this.icon_size) / 2, x2 = this.thickness - (this.thickness - this.icon_size) / 2, y1 = this.thickness / 2, y2 = this.thickness / 2;
		minimizeButton.innerHTML = '<svg width="' + this.thickness + '" height="' + this.thickness + '"><path d="M ' + x1 + ',' + y1 + ' ' + x2 + ',' + y2 + '" /></svg>';
		minimizeButton.onclick = function(){
			var window = app.remote.getCurrentWindow();
			window.minimize();
		};
		minimizeButton.tabIndex = "-1";
		buttonsWrapper.appendChild(minimizeButton);

		var maximizeButton = document.createElement("button");
		PGCM(maximizeButton).add("max-button");
		maximizeButton.type = "button";

		this.genMaximizeIcon = function(){
			var x1 = y1 = (this.thickness - this.icon_size) / 2, x2 = y2 = this.thickness - (this.thickness - this.icon_size) / 2;
			var arrowGap = 4;
			var maximizeIcon = '<svg width="' + this.thickness + '" height="' + this.thickness + '"><path d="M ' + x1 + ',' + (y1 + arrowGap) + ' V ' + y2 + ' H ' + (x2 - arrowGap) + '" /><path d="M ' + (x1 + arrowGap) + ',' + y1 + ' H ' + x2 + ' V ' + (y2 - arrowGap) + '" /></svg>';
			var arrowLength = this.icon_size - arrowGap;
			var restoreIcon = '<svg width="' + this.thickness + '" height="' + this.thickness + '"><path d="M ' + (this.thickness / 2 - 2 - arrowLength) + ',' + (this.thickness / 2 + 2) + ' h ' + arrowLength + ' v ' + arrowLength + '" /><path d="M ' + (this.thickness / 2 + 2) + ',' + (this.thickness / 2 - 2 - arrowLength) + ' v ' + arrowLength + ' h ' + arrowLength + '" /></svg>';
			var window = app.remote.getCurrentWindow();
			return window.isMaximized() ? restoreIcon : maximizeIcon;
		}

		maximizeButton.innerHTML = this.genMaximizeIcon();
		var obj = this;
		maximizeButton.onclick = function(){
			var window = app.remote.getCurrentWindow();
			if(window.isMaximized()){
				window.unmaximize();
			}else{
				window.maximize();
			}
			obj.genMaximizeIcon();
		};
		maximizeButton.tabIndex = "-1";
		buttonsWrapper.appendChild(maximizeButton);

		var closeButton = document.createElement("button");
		PGCM(closeButton).add("close-button");
		closeButton.type = "button";
		var x1 = y1 = (this.thickness - this.icon_size) / 2, x2 = y2 = this.thickness - (this.thickness - this.icon_size) / 2;
		closeButton.innerHTML = '<svg width="' + this.thickness + '" height="' + this.thickness + '"><path d="M ' + x1 + ',' + y1 + ' ' + x2 + ',' + y2 + '" /><path d="M ' + x2 + ',' + y1 + ' ' + x1 + ',' + y2 + '" /></svg>';
		closeButton.onclick = function(){
			var window = app.remote.getCurrentWindow();
			window.close();
		};
		closeButton.tabIndex = "-1";
		buttonsWrapper.appendChild(closeButton);
	}

	this.titleBarAllowance = document.createElement("div");
	PGCM(this.titleBarAllowance).add("title-gap");
	var buttonGap = document.createElement("div");
	PGCM(buttonGap).add("button-gap");
	this.titleBarAllowance.appendChild(buttonGap);

	this.updateResize();
	this.updateScroll();
}

PGTitleBar.prototype.insert = function(){
	this.doc.body.insertBefore(this.titleBar, this.doc.body.firstChild);
	return this;
};

PGTitleBar.prototype.insert_gap = function(element){
	element = element || this.doc.body;
	element.insertBefore(this.titleBarAllowance, element.firstChild);
	this.titleBarAllowance.querySelector(".button-gap").style.width = this.hideButtons ? 0 : this.titleBar.querySelector(".button-wrapper").clientWidth + "px";
	return this;
};

PGTitleBar.prototype.updateResize = function(){
	var obj = this;
	this.resize_fn = function(){
		if(obj.doc.body.contains(obj.titleBar)){
			if (!obj.hideButtons) obj.titleBar.querySelector(".max-button").innerHTML = obj.genMaximizeIcon();
			var titleBarCM = PGCM(obj.titleBar);
			var window = app.remote.getCurrentWindow();
			if(window.isMaximized()){
				titleBarCM.add("maximized");
			}else{
				titleBarCM.remove("maximized");
			}
		}else{
			obj.docWindow.removeEventListener("resize", obj.resize_fn);
		}
	};
	this.docWindow.removeEventListener("resize", this.resize_fn);
	this.docWindow.addEventListener("resize", this.resize_fn);
	return this;
};

PGTitleBar.prototype.setScrollPoint = function(x){
	this.scrollPoint = x;
}

PGTitleBar.prototype.updateScroll = function(){
	var obj = this;
	this.scroll_fn = function(){
		if(obj.doc.body.contains(obj.titleBar)){
			var y = obj.doc.body.scrollTop || obj.doc.documentElement.scrollTop;
			if(y <= obj.scrollPoint){
				PGCM(obj.titleBar).remove("scrolled-down");
			}else{
				PGCM(obj.titleBar).add("scrolled-down");
			}
		}else{
			obj.docWindow.removeEventListener("scroll", obj.scroll_fn);
		}
	};
	this.docWindow.removeEventListener("scroll", this.scroll_fn);
	this.docWindow.addEventListener("scroll", this.scroll_fn);
};

function PGCM(element){
	return new PGClassManager(element);
}

function PGClassManager(element){
	this.element = element;
}

PGClassManager.prototype.add = function(name){
	if(this.element.classList){
		this.element.classList.add(name);
	}else{
		var cn = this.element.className || "";
		var arr = this.element.className.split(" ");
		if(arr.indexOf(name) == -1){
			this.element.className += " " + name;
		}
	}
};

PGClassManager.prototype.remove = function(name){
	if(this.element.classList){
		this.element.classList.remove(name);
	}else{
		var regName = "\\b" + name + "\\b";
		this.element.className = this.element.className.replace(new RegExp(regName, "g"), "");
	}
};

PGClassManager.prototype.contains = function(name){
	if(this.element.classList){
		return this.element.classList.contains(name);
	}else{
		var regName = "\\b" + name + "\\b";
		return new RegExp(regName, "g").test(this.element.className);
	}
};

PGClassManager.prototype.toggle = function(name){
	if(this.element.classList){
		this.element.classList.toggle(name);
	}else{
		var classes = this.element.className.split(" ");
		var i = classes.indexOf(name);

		if(i >= 0){
			classes.splice(i, 1);
		}else{
			classes.push(name);
		}
		this.element.className = classes.join(" ");
	}
};