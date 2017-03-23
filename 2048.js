var game={
	data:null,
	RN:5,//行数与列数
	CN:5,
	score:0,//保存分数
	state:0,
	RUNNING:1,
	GAMEOVER:0,
	getGridsHtml:function(){
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		return '<div id="g'+arr.join('" class="grid"></div><div id="g')+'" class="grid"></div>';
	},
	init:function(){
		var gp=document.getElementById("gridPanel");
		gp.style.width=116*this.CN+16+"px";
		gp.style.height=116*this.RN+16+"px";
		gp.innerHTML=this.getGridsHtml()+this.getCellHtml();
		console.log(gp);
	},
	getCellHtml:function(){
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		return '<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>';
	},
	start:function(){
		this.init();
		
		this.state=this.RUNNING;
		this.score=0;
		this.data=[];
		for(var r=0;r<this.RN;r++){
			this.data[r]=[];
			for(var c=0;c<this.CN;c++){
				this.data[r][c]=0;
			}
		}
		//随机生成两个2或4
		this.randomNum();
		this.randomNum();
		this.updataView();
	},
	isGameOver:function(){
		//遍历data所有元素，如果当前元素值=0，return false 
		//否则 如果当前列不是最右侧列且当前元素等于右侧元素，return flase
		//否则 如果当前行不是最后一行且当前元素等于下方元素，return false
		//结束将游戏状态改成gameover，返回true
		for(var r=0;r<this.data.length;r++){
			for(var c=0;c<this.data[r].length;c++){
				if(this.data[r][c]==0){return false;}else{
					if((r!=this.data.length-1)&&(this.data[r][c]==this.data[r+1][c])){
						return false;
					}else if((c!=this.data[r].length-1)&&(this.data[r][c]==this.data[r][c+1])){
						return false;
					}
				}
			}
		}
		this.state=this.GAMEOVER;
		return true;
	},
	randomNum:function(){//随机挑选一个位置随机生成2或4
		//反复执行生成行和列下标
		//生成一个随机数<0.5则生成2，反之4
		if(!this.isFull()){
			while(true){			
				var row=parseInt(Math.random()*this.RN);
				var col=parseInt(Math.random()*this.CN);
				if(this.data[row][col]==0){
					this.data[row][col]=Math.random()<0.5?2:4;
					break;
				}
			}
		}
	},
	isFull:function(){
		for(var row=0;row<this.data.length;row++){
			for(var col=0;col<this.data[row].length;col++){
				if(this.data[row][col]==0){
					return false;
				}
			}
		}
		return true;
	},
	updataView:function(){
		for(var row=0;row<this.data.length;row++){
			for(var col=0;col<this.data[row].length;col++){
				var div=document.getElementById("c"+row+col);
				if(this.data[row][col]!==0){
					div.innerHTML=this.data[row][col];
					div.className="cell n"+this.data[row][col];
				}else{
					div.className="cell";
					div.innerHTML="";
				}
			}
	    }
		var span=document.getElementById("score");
		span.innerHTML=this.score;
		var gameover=document.getElementById("gameover");
		if(this.state==this.GAMEOVER){
			var span=document.getElementById("finalScore");
			span.innerHTML=this.score;
			gameover.style.display="block";
		}else{
			gameover.style.display="none";
		}
	},
	moveLeft:function(){
		var before=this.data.toString();
		for(var r=0;r<this.data.length;r++){
			this.moveLeftInRow(r);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updataView();
		}
	},
	moveLeftInRow:function(r){
		for(var c=0;c<this.data[r].length-1;c++){
			var next=this.getRightNext(r,c);
			if(next==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[r][next];
					this.data[r][next]=0;
					c--;
				}else if(this.data[r][c]==this.data[r][next]){
					this.data[r][c]*=2;
					this.data[r][next]=0;
					this.score+=this.data[r][c];
				}
			}
		}	
	},
	getRightNext:function(r,c){
		for(var next=c+1;next<this.data[r].length;next++){
			if(this.data[r][next]!=0){
				return next;
			}
		}
		return -1;
	},
	getLeftNext:function(r,c){
		for(var next=c-1;next>=0;next--){
			if(this.data[r][next]!=0){
				return next;
			}
		}
		return -1;
	},
	moveRightInRow:function(r){
		for(var c=this.data[r].length-1;c>0;c--){
			var next=this.getLeftNext(r,c);
			if(next==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[r][next];
					this.data[r][next]=0;
					c++;
				}else if(this.data[r][c]==this.data[r][next]){
					this.data[r][c]*=2;
					this.data[r][next]=0;
					this.score+=this.data[r][c];
				}
			}
		}
	},
	moveRight:function(){
		var before=this.data.toString();
		for(var r=0;r<this.data.length;r++){
			this.moveRightInRow(r);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updataView();
		}
	},
	moveUp:function(){
		var before=this.data.toString();
		for(var c=0;c<this.data.length;c++){
			this.moveUpInCol(c);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updataView();
		}
	},
	getNextDown:function(r,c){
		for(var down=r+1;down<this.data.length;down++){
			if(this.data[down][c]!=0){
				return down;
			}
		}
		return -1;
	},
	moveUpInCol:function(c){
		for(var r=0;r<this.data.length-1;r++){
			var down=this.getNextDown(r,c);
			if(down==-1){break;}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[down][c];
					this.data[down][c]=0;
					r--;
				}else if(this.data[r][c]==this.data[down][c]){
					this.data[r][c]*=2;
					this.data[down][c]=0;
					this.score+=this.data[r][c];
				}
			}
		}
	},
	moveDown:function(){
		var before=this.data.toString();
		for(var c=0;c<this.data.length;c++){
			this.moveDownInCol(c);
		}
		var after=this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isGameOver();
			this.updataView();
		}
	},
	getNextUp:function(r,c){
		for(var up=r-1;up>=0;up--){
			if(this.data[up][c]!=0){
				return up;
			}
		}
		return -1;
	},
	moveDownInCol:function(c){
		for(var r=this.data.length-1;r>0;r--){
			var up=this.getNextUp(r,c);
			if(up==-1){break;}else if(this.data[r][c]==0){
				this.data[r][c]=this.data[up][c];
				this.data[up][c]=0;
				r++;
			}else if(this.data[r][c]==this.data[up][c]){
				this.data[r][c]*=2;
				this.data[up][c]=0;
				this.score+=this.data[r][c];
			}
		}
	}
}
//页面加载完成后，启动游戏
window.onload=function(){
	game.start();
	//按键按下时
	document.onkeydown=function(){
		if(game.state==game.RUNNING){//只有游戏运行时才响应操作
			var e=window.event||arguments[0];
			if(e.keyCode==37){
				game.moveLeft();
			}else if(e.keyCode==39){
				game.moveRight();
			}else if(e.keyCode==38){
				game.moveUp();
			}else if(e.keyCode==40){
				game.moveDown();
			}
		}
	}
}
