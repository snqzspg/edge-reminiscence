(function(win){
	function windowWidth(){
		return win.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	}

	function windowHeight(){
		return win.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	}

	function getOffsetTop(elem){
	    var offsetTop = 0;
		do {
			if ( !isNaN( elem.offsetTop ) ){
				offsetTop += elem.offsetTop;
			}
		} while ( elem = elem.offsetParent );
		return offsetTop;
	}

	function ExpandCardEffect(){
		this.effectElement.classList.add("modal-transition");
		this.effectElement.classList.add("hidden");
		this.effectElement.style.display = "none";

		var obj = this;
		this.resz = function(){
			obj.resize();
		};
	}

	ExpandCardEffect.prototype.effectElement = document.createElement("div");
	ExpandCardEffect.prototype.expanding_phase = 0; // Expanding phase 1, 2 or 3. 0 - not expanding.
	ExpandCardEffect.prototype.contracting_phase = 0; // Contracting phase 1, 2 or 3. 0 - not contracting.
	ExpandCardEffect.prototype.lastTile = null;
	ExpandCardEffect.prototype.lastModal = null;
	ExpandCardEffect.prototype.tileCoverFn = function(){};

	ExpandCardEffect.prototype.appendIfNotDone = function(){
		var body = document.body;
		if (this.effectElement.parentNode != body) {
			body.appendChild(this.effectElement);
			win.addEventListener("resize", this.resz);
		}
	};

	ExpandCardEffect.prototype.removeFromDom = function(){
		var parent = this.effectElement.parentNode;
		parent.removeChild(this.effectElement);
		win.removeEventListener("resize", this.resz);
	};

	ExpandCardEffect.prototype.expand = function(tile, modalbox, content, actionHTML, hideBackButton, callback) {
		// Disables css transitions and fit the modal transition box on the clicked tile.
		// Tile Rect
		if (tile) {
			var rect = tile.getBoundingClientRect();
		}
		var modalGapFromEdge = 20;
		var headerSpacing = 40;
		var appTitle = document.querySelector("header.main > h1");
		var titleRect = appTitle.getBoundingClientRect();
		var topGap = 2 * headerSpacing + appTitle.clientHeight;
		//var topGap = document.querySelector("header.main").clientHeight - document.querySelector("header.main .status").clientHeight - parseFloat(win.getComputedStyle(document.querySelector("header.main .status")).marginTop) - parseFloat(win.getComputedStyle(document.querySelector("header.main .status")).marginBottom);
		var infoModalRect = {x: modalGapFromEdge, y: topGap, width: windowWidth() - 2 * modalGapFromEdge, height: windowHeight() - topGap - modalGapFromEdge};
		this.appendIfNotDone();

		//Insert modal content first
		modalbox.update(content, actionHTML, hideBackButton);
		modalbox.insert();
		var obj = this;
		modalbox.backButton.onclick = function(){
			obj.contract();
		};
		this.lastModal = modalbox;

		this.effectElement.style.transition = "all 0s ease 0s";
		this.effectElement.offsetHeight;
		if (tile) {
			var hasTileClass = tile.classList.contains("tile");
			this.effectElement.style.transform = "translate(" + (rect.x + rect.width / 2 - 50) + "px, " + (rect.y + rect.height / 2 - 50) + "px) scale(" + rect.width * (hasTileClass ? 1.05 : 1) / 100 + ", " + rect.height * (hasTileClass ? 1.05 : 1) / 100 + ")";
			this.tileCoverFn = function(){
				var rect1 = tile.getBoundingClientRect();
				var hasTileClass1 = tile.classList.contains("tile");
				obj.effectElement.style.transform = "translate(" + (rect1.x + rect1.width / 2 - 50) + "px, " + (rect1.y + rect1.height / 2 - 50) + "px) scale(" + rect1.width * (hasTileClass ? 1.05 : 1) / 100 + ", " + rect1.height * (hasTileClass ? 1.05 : 1) / 100 + ")";
			};
		} else {
			this.effectElement.style.transform = "translate(" + (windowWidth() / 2 - 50) + "px, " + (windowHeight() / 2 - 50) + "px) scale(0)";
			this.tileCoverFn = function(){
				obj.effectElement.style.transform = "translate(" + (windowWidth() / 2 - 50) + "px, " + (windowHeight() / 2 - 50) + "px) scale(0)";
			};
		}
		this.effectElement.style.display = "";
		this.effectElement.style.transition = "";
		this.effectElement.offsetHeight;
		this.effectElement.classList.remove("hidden");
		this.expanding_phase = 1;
		this.lastTile = tile ? tile : 0;

		// Move the App title to the correct position and hide the status.
		document.querySelector("header.main .status").classList.add("hidden");
		document.querySelector(".tile-container").classList.add("hidden");

		var effElement = this.effectElement;
		setTimeout(function(){
			effElement.style.transform = "translate(" + (infoModalRect.x + infoModalRect.width / 2 - 50) + "px, " + (infoModalRect.y + infoModalRect.height / 2 - 50) + "px) scale(" + infoModalRect.width / 100 + ", " + infoModalRect.height / 100 + ")";
			obj.expanding_phase = 2;
			appTitle.style.transform = "translateY(-" + (getOffsetTop(appTitle) - headerSpacing) + "px)";
		}, 100);
		setTimeout(function(){
			modalbox.show();
			effElement.classList.add("hidden");
			obj.expanding_phase = 3;
		}, 400);
		setTimeout(function(){
			obj.expanding_phase = 0;
			effElement.style.display = "none";
		}, 500);
	};

	ExpandCardEffect.prototype.contract = function(callback) {
		// Disables css transitions and fit the modal transition box on the clicked tile.
		// Tile Rect
		if (this.lastTile) var rect = this.lastTile.getBoundingClientRect();
		var modalGapFromEdge = 20;
		var headerSpacing = 40;
		var appTitle = document.querySelector("header.main > h1");
		var topGap = 2 * headerSpacing + appTitle.clientHeight;
		var infoModalRect = {x: modalGapFromEdge, y: topGap, width: windowWidth() - 2 * modalGapFromEdge, height: windowHeight() - topGap - modalGapFromEdge};

		this.effectElement.style.transition = "all 0s ease 0s";
		this.effectElement.offsetHeight;
		this.effectElement.style.transform = "translate(" + (infoModalRect.x + infoModalRect.width / 2 - 50) + "px, " + (infoModalRect.y + infoModalRect.height / 2 - 50) + "px) scale(" + infoModalRect.width / 100 + ", " + infoModalRect.height / 100 + ")";
		
		this.effectElement.style.display = "";
		this.effectElement.style.transition = "";
		this.effectElement.offsetHeight;
		this.effectElement.classList.remove("hidden");
		this.contracting_phase = 1;
		var hasTile = this.lastTile;
		delete this.lastTile;
		var effElement = this.effectElement;
		var obj = this;
		setTimeout(function(){
			obj.contracting_phase = 2;
			obj.lastModal.hide();
			if (hasTile) {
				effElement.style.transform = "translate(" + (rect.x + rect.width / 2 - 50) + "px, " + (rect.y + rect.height / 2 - 50) + "px) scale(" + rect.width / 100 + ", " + rect.height / 100 + ")";
			} else {
				effElement.style.transform = "translate(" + (windowWidth() / 2 - 50) + "px, " + (windowHeight() / 2 - 50) + "px) scale(0)";
			}
			appTitle.style.transform = "";
		}, 100);
		setTimeout(function(){
			document.querySelector("header.main .status").classList.remove("hidden");
			document.querySelector(".tile-container").classList.remove("hidden");
		}, 300);
		setTimeout(function(){
			effElement.classList.add("hidden");
			obj.contracting_phase = 3;
		}, 400);
		setTimeout(function(){
			obj.contracting_phase = 0;
			effElement.style.display = "none";
		}, 500);
	};

	ExpandCardEffect.prototype.resize = function() {
		if (this.isCoveringModal() || this.isTransiting()) {
			var modalGapFromEdge = 20;
			var headerSpacing = 40;
			var appTitle = document.querySelector("header.main > h1");
			var titleRect = appTitle.getBoundingClientRect();
			var topGap = 2 * headerSpacing + appTitle.clientHeight;
			var infoModalRect = {x: modalGapFromEdge, y: topGap, width: windowWidth() - 2 * modalGapFromEdge, height: windowHeight() - topGap - modalGapFromEdge};
			if (this.isCoveringModal()) {
				this.effectElement.style.transition = "all 0s ease 0s";
				this.effectElement.offsetHeight;
				appTitle.style.transition = "all 0s ease 0s";
				appTitle.offsetHeight;
			}
			this.effectElement.style.transform = "translate(" + (infoModalRect.x + infoModalRect.width / 2 - 50) + "px, " + (infoModalRect.y + infoModalRect.height / 2 - 50) + "px) scale(" + infoModalRect.width / 100 + ", " + infoModalRect.height / 100 + ")";
			appTitle.style.transform = "translateY(-" + (getOffsetTop(appTitle) - headerSpacing) + "px)";
			if (this.isCoveringModal()) {
				this.effectElement.style.transition = "";
				this.effectElement.offsetHeight;
				appTitle.style.transition = "";
				appTitle.offsetHeight;
			}
		} else if (this.isCoveringTile()) {
			this.tileCoverFn();
		}
	};

	ExpandCardEffect.prototype.isCoveringTile = function(){
		return (this.expanding_phase == 0 && this.contracting_phase == 0 && this.lastTile == null) || this.expanding_phase == 1 || this.contracting_phase == 3;
	}

	ExpandCardEffect.prototype.isTransiting = function(){
		return this.expanding_phase == 2 || this.contracting_phase == 2;
	}

	ExpandCardEffect.prototype.isCoveringModal = function(){
		return (this.expanding_phase == 0 && this.contracting_phase == 0 && this.lastTile != null) || this.expanding_phase == 3 || this.contracting_phase == 1;
	}

	win.ExpandCardEffect = ExpandCardEffect;
})(window);