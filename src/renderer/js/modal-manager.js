function ModalBox(){
	this.element.classList.add("modal-full");
	this.element.style.visibility = "hidden";
	this.backButton.classList.add("back-button");
	this.backButton.type = "button";
	this.backButton.title = "Back";
	this.backButton.innerHTML = '<svg width="20" height="20"><path class="stroke" style="fill:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;" d="M 14.687492,3.125 5.3124919,10 14.687492,16.875"></path></svg>';
	this.element.appendChild(this.backButton);
	this.actionElement.classList.add("modal-full-action");
	this.actionElement.style.visibility = "hidden";
	var obj = this;
	this.resz = function(){
		obj.resize();
	};
}

ModalBox.prototype.element = document.createElement("div");
ModalBox.prototype.backButton = document.createElement("button");
ModalBox.prototype.haveAction = false;
ModalBox.prototype.actionElement = document.createElement("div");
ModalBox.prototype.actionFillerElement = document.createElement("div");

ModalBox.prototype.resize = function(){
	//var status = document.querySelector("header.main .status");
	var headerSpacing = 40;
	var topGap = 2 * headerSpacing + document.querySelector("header.main > h1").clientHeight;
	//var topGap = document.querySelector("header.main").clientHeight - status.clientHeight - parseFloat(window.getComputedStyle(status).marginTop) - parseFloat(window.getComputedStyle(status).marginBottom);
	this.element.style.top = topGap + "px";
	this.actionFillerElement.style.height = this.actionElement.getBoundingClientRect().height + "px";
};

ModalBox.prototype.insert = function(){
	document.body.appendChild(this.element);
	if (this.haveAction) {
		document.body.insertBefore(this.actionElement, this.element.nextSibling);
		this.element.appendChild(this.actionFillerElement);
	}
	window.addEventListener('resize', this.resz);
	this.resz();
};

ModalBox.prototype.insertAction = function(){
	document.body.insertBefore(this.actionElement, this.element.nextSibling);
	this.element.appendChild(this.actionFillerElement);
	this.resz();
};

ModalBox.prototype.remove = function(){
	this.removeAction();
	document.body.removeChild(this.element);
	window.removeEventListener('resize', this.resz);
};

ModalBox.prototype.removeAction = function(){
	if (this.actionElement.parentNode) {
		this.actionElement.parentNode.removeChild(this.actionElement);
	}
	if (this.actionFillerElement.parentNode) {
		this.actionFillerElement.parentNode.removeChild(this.actionFillerElement);
	}
};

ModalBox.prototype.show = function(){
	this.element.style.visibility = "";
	this.actionElement.style.visibility = "";
};

ModalBox.prototype.hide = function(){
	this.element.style.visibility = "hidden";
	this.actionElement.style.visibility = "hidden";
};

ModalBox.prototype.update = function(html, actionHTML, hideBackButton){
	this.element.innerHTML = html;
	if (!hideBackButton) this.element.insertBefore(this.backButton, this.element.firstChild);
	this.haveAction = !!actionHTML;
	if (actionHTML) {
		this.actionElement.innerHTML = actionHTML;
		this.insertAction();
		this.resz();
	} else {
		this.removeAction();
	}
};