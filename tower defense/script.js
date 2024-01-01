var state = 0;
var levelmap=0;
var boxes = [];
var pathPixels=[];
var enemyPath = [];
var start = -1;
var end=-1;
var wave=0;
var waveHappening=false;
var playerHealth=100;
var fib=[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584]
var coins=100;
var hi =[];
var clicked=false;
var enemies=[];
var towers=[];
var towerSelected=false;
var towerImgs=[];
var towerProperties=[[35,2,4,1,2,3,5,6,6,"blue",35],[70,5,8,4,7,6,7,8,9,"red",70],[55,3,6,4,5,2,3,5,6,"white",55],[130,9,10,8,9,2,8,4,7,"yellow",130],[90,3,5,6,8,7,9,6,8,"#cc5f00",90]]
//price,  start_reload, max_reload, start_bulletspeed,max_bulletspeed, start_damage, max_damage, range, max_range, laser_color,start_price
var collapsed=true;
var extraClick=0;
var selectTool=-1;
var stepThing=1;
var paths;
var steps = ["Select the starting point","Select the ending point","Let pathfinder cook","You're done! You can change the path by pressing this button"];
var errorMessage=-1;
var errorMessages=["The start point must be on an edge of the map","The point you selected must be on the path","The point must be on the opposite edge of the starting point","There is not a straight path from start to end","Oops! Pathfinder hit a fork in the road."];
function setup() {
  createCanvas(600, 1000);
  rectMode(CORNER)
  angleMode(DEGREES)
  paths=[loadImage("path1.png"),loadImage("path2.png")];
  custom=loadImage("custom.png");
  edit=loadImage("click.png");
  for(let i=1;i<6;i++){
    towerImgs.push(loadImage("tower"+i+".png"))
  }
}

function draw() {
  hi.push(rect(200,200,50,50))
  function box(x,y,width,height,color,boxImg,purpose){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.boxImg=boxImg;
      this.purpose = purpose;
      this.draw=function(){
        strokeWeight(3)
        if(mouseX>this.x && mouseX<this.x+this.width && mouseY>this.y && mouseY<this.y+this.height){
          fill(this.color);

        rect(this.x-5,this.y-5,this.width+10,this.height+10);
        image(this.boxImg,this.x-5,this.y-5,this.width+10,this.height+10)
          if(mouseIsPressed==true){
            if(state==0){
              if(this.x==360&&this.y==305){
            state=1;
              }else{
                state=2;
                if(((this.x-50)/155)+1+(3*((this.y-150)/155))==6){
                levelmap=((this.x-50)/155)+1+(3*((this.y-150)/155));
                }else{
                  
                  levelmap=((((this.x-50)/155)+1+(3*((this.y-150)/155)))%2);
                  if(levelmap==0){
                    levelmap=2;
                  }
                }
                
              }
            }
          }
        }else{
        fill(this.color);
        rect(this.x,this.y,this.width,this.height);
          image(this.boxImg,this.x,this.y,this.width,this.height)
        }
      }
    }
  function enemy(x,y,health,speed,size){
    this.x=x;
    this.y=y;
    this.pixel=0
    this.health=health;
    this.speed=speed;
    this.size=size;
    this.active=false;
    this.dead=false;
    this.draw=function(){
      if(this.health<=3){
        fill("red");
      }else if(this.health<=10){
        fill("yellow");
      }else{
        fill("green");
      }
      if(pInBox(this.x,this.y,50,100,456,456)&&this.dead==false){
      this.active=true;                                     
      rect(this.x, this.y, this.size, this.size,5)
      fill("black");
      textSize(12)
      text(ceil(this.health),this.x+this.size/2-5,this.y+this.size/2+5)
      }else{
        if(pInBox(this.x,this.y,50,100,456,456)){
          this.active=true;
        }else{
        this.active=false
        }
      }
      if(this.health<=0&& this.dead==false){
        this.dead=true;
        coins+=10;
      }
    }
    this.move=function(px1,px2){
      this.pixel=px1;
      if(this.x==coordsofPixel(px2,50,100,456,456,24,24)[0]&&this.y==coordsofPixel(px2,50,100,456,456,24,24)[1]){
        this.pixel=px2;
      }
      if(coordsofPixel(px1,50,100,456,456,24,24)[0]==coordsofPixel(px2,50,100,456,456,24,24)[0]){
        this.x=coordsofPixel(px1,50,100,456,456,24,24)[0];
        if(this.y!=coordsofPixel(px2,50,100,456,456,24,24)[1]){
          this.y+=this.speed-((this.speed*2)*(coordsofPixel(px1,50,100,456,456,24,24)[1]>coordsofPixel(px2,50,100,456,456,24,24)[1]));
          if(this.y>coordsofPixel(px2,50,100,456,456,24,24)[1]&&this.speed-((this.speed*2)*(coordsofPixel(px1,50,100,456,456,24,24)[1]>coordsofPixel(px2,50,100,456,456,24,24)[1]))==this.speed){
            this.y=coordsofPixel(px2,50,100,456,456,24,24)[1]
            this.pixel=px2
          }else if(this.y<coordsofPixel(px2,50,100,456,456,24,24)[1]&&this.speed-((this.speed*2)*(coordsofPixel(px1,50,100,456,456,24,24)[1]>coordsofPixel(px2,50,100,456,456,24,24)[1]))==-this.speed){
            this.y=coordsofPixel(px2,50,100,456,456,24,24)[1]
            this.pixel=px2
            
          }
        }
    }else if(coordsofPixel(px1,50,100,456,456,24,24)[1]==coordsofPixel(px2,50,100,456,456,24,24)[1]){
        this.y=coordsofPixel(px1,50,100,456,456,24,24)[1];
        if(this.x!=coordsofPixel(px2,50,100,456,456,24,24)[0]){
          this.x+=this.speed-((this.speed*2)*(coordsofPixel(px1,50,100,456,456,24,24)[0]>coordsofPixel(px2,50,100,456,456,24,24)[0]));
          if(this.x>coordsofPixel(px2,50,100,456,456,24,24)[0]&&this.speed-((this.speed*2)*(coordsofPixel(px1,50,100,456,456,24,24)[0]>coordsofPixel(px2,50,100,456,456,24,24)[0]))==this.speed){
            this.x=coordsofPixel(px2,50,100,456,456,24,24)[0]
          }else if(this.x<coordsofPixel(px2,50,100,456,456,24,24)[0]&&this.speed-((this.speed*2)*(coordsofPixel(px1,50,100,456,456,24,24)[0]>coordsofPixel(px2,50,100,456,456,24,24)[0]))==-this.speed){
            this.x=coordsofPixel(px2,50,100,456,456,24,24)[0]
          }
        }
    }
  }
  }
  function tower(x,y,lvl,type,size,placed){
    this.x=x;
    this.y=y;
    this.lvl=lvl;
    this.type=type;
    this.size=size;
    this.placed=placed; 
    this.reload_frame=0;
    this.lasers=[]
    this.properties=towerProperties[this.type]
    this.draw=function(){
      if(this.placed==false){
        tint(127,255)
      }else{
        noTint()
      }
      image(towerImgs[this.type],this.x,this.y,size,size)
      noTint()
    }
    this.checkIsIn=function(x,y,click){
      if(click==true){
        if(mouseIsPressed&pInBox(x,y,this.x,this.y,this.x+size,this.y+size)){
          //size
        }
      }else{
        if(pInBox(x,y,this.x,this.y,size,size)){
          return true;
        }else{
          return false;
        }
      }
    }
    this.findEnemiesInRange=function(){
      var range=this.properties[1]
      var enemiesInRange=[]
      for(let i=0;i<enemies.length;i++){
        if(dist(this.x,this.y,enemies[i].x,enemies[i].y)<=360*(this.properties[7]/10)&& !enemies[i].dead
        &&enemies[i].active==true){
          enemiesInRange.push(enemies[i])
        }
      }
      return enemiesInRange
    }
    this.shootStuff=function(){
      if(this.reload_frame>0){
        this.reload_frame-=1
      }else{
        if(this.findEnemiesInRange().length>0){
        this.lasers.push(new laser(this.x+12,this.y+12,this.properties[9],this.findEnemiesInRange()[0],this))
        if(this.properties[1]<5){
        this.reload_frame=(35-(this.properties[1]*4.1))
        }
        if(this.properties[1]>4){
          this.reload_frame=(35-(this.properties[1]*3.35))
          }
        }
      }
      for(let i=0;i<this.lasers.length;i++){
        this.lasers[i].draw()
        this.lasers[i].heatseek()
      }
    }
  }
  function dist(x1,y1,x2,y2){
    return sqrt(((x1-x2)**2)+((y1-y2)**2))
  }
  function laser(x,y,color,target,parent){
    this.x=x
    this.y=y
    this.color=color
    this.parent=parent
    //if parent = type 4 tower, extra coins for each kill
    this.target=target
    //enemy object
    this.active=true;
    this.draw=function(){
      //         
      if(this.active){  
      //console.log(this.color) 
      //noTint();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
      fill(this.color);
      stroke(this.color);
      ellipse(this.x,this.y,5,5)
      }
      stroke(0,0,0,0)
      strokeWeight(0)
      strokeWeight(0)
    }
    this.heatseek=function(){
      if(this.active){  
      var xInc=0;
      var yInc=0;
      var speedFactor=7/10;
      if(this.target.dead==true){
        if(this.parent.findEnemiesInRange().length>0){
        this.target=this.parent.findEnemiesInRange()[0]
        }else{
          this.target=false
        }
      }
      if(this.target.false){
        if(this.parent.findEnemiesInRange().length>0){
          this.target=this.parent.findEnemiesInRange()[0]
          }
      }
      if(this.target!==false){
        //this.x=this.target.x
        //this.y=this.target.y

        if(this.x<this.target.x){
          if(this.target.x-(speedFactor*this.parent.properties[3])<this.x){
            xInc=this.target.x-this.x;
          }else{
            xInc=speedFactor*this.parent.properties[3];
          }
        }else{
          if(this.x-speedFactor*this.parent.properties[3]<this.target.x){
            xInc=-(this.x-this.target.x);
          }else{
            xInc=-(speedFactor*this.parent.properties[3]);
          }
        }
        if(this.y<this.target.y){
          if(this.target.y-speedFactor*this.parent.properties[3]<this.y){
            yInc=this.target.y-this.y;
          }else{
            yInc=speedFactor*this.parent.properties[3];
          }
        }else{
          if(this.y-(speedFactor*this.parent.properties[3])<this.target.y){
            yInc=-(this.y-this.target.y);
          }else{
            yInc=-(speedFactor*this.parent.properties[3]);
          }
        }
        //console.log(xInc,yInc)
        //console.log(this.x,this.y)
        this.x+=xInc;
        this.y+=yInc;
        for(let i=0;i<enemies.length;i++){
          if(pInBox(this.x,this.y,enemies[i].x,enemies[i].y,enemies[i].size,enemies[i].size)&& enemies[i].dead==false){
            enemies[i].health-=(this.parent.properties[5]/5);
            this.active=false
            if(enemies[i].health<=0){
              enemies[i].dead=true;
              if(this.parent.type==4){
                if(wave>25){
                  coins+=20-round(wave/5);
                  }else{
                    coins+=5;
                  }
              }else{
                if(wave<25){
                coins+=10-round(wave/5);
                }else{
                  coins+=3
                }
                
              }
            }
          }
        }
      }
    }
    }
    this.findYInc=function(x1,y1,x2,y2){
      angleMode(RADIANS);
      var angle=0;
      if(y2!==y1){
      angle =atan((x2-x1)/(y2-y1))
      }else{
        angle= 0;
      }
      return tan(angle)*(x2-x1)
    }
  }
  function pInBox(x,y,bx,by,bw,bh){
    if(x>=bx && x<=bx+bw && y>=by && y<=by+bh){
      return true
    }else{
      return false
    }
  }
  function pixelPIn(x,y,gx,gy,gw,gh,xInc,yInc){
    if(pInBox(x,y,gx,gy,gw,gh)){
       return((ceil(gw/xInc)*floor((y-gy)/yInc))+1+floor((x-gx)/xInc))
      }else{
      return(-1)
    }
  }
  function coordsofPixel(pixel,gx,gy,gw,gh,xInc,yInc){
    if(pixel>0){
    return([gx+((((pixel-1) % (gw/xInc)))*xInc),gy+(floor((pixel-1)/(gw/xInc))*yInc)])
    }else{
      return([-100,-100])
    }
  }
  function pathFind(start,end){
    var r =[];
    enemyPath=[];
    var currentPixel=start;
    var endLoop=false;
    var currentDir="";
    let pathfinder_cookNow;
    while (endLoop===false && currentPixel!==end ){
      enemyPath.push(currentPixel)
      if(currentPixel==start){
        
      if(getNeighbors(currentPixel).length==1){
        currentDir= getNeighbors(currentPixel,true);
        currentPixel=getNeighbors(currentPixel)[0];
        }else{
        endLoop=true
        }
      }else{
        if(getNeighbors(currentPixel).length==2){
          currentDir= getNeighbors(currentPixel,true);
          currentPixel=getNeighbors(currentPixel)[0];
          }else{
          endLoop=true;
          }
      }
      
    }
    if(currentPixel==end){
      r=["done"];
    }else if(getNeighbors(currentPixel).length<2 && currentPixel!=start){
      r=["no path"];
    }else{
      r=getDirections(currentPixel,currentDir);
    }
    console.log(getNeighbors(23));
    return r
  }
  function getNeighbors(pixel,getDir){
    var neighbors=[]
    var dirChange="";
    if(contains(pathPixels,pixel+1)&&(pixel%19)!==0){
      neighbors.push(pixel+1);
      dirChange="right";
    }
    if(contains(pathPixels,pixel-1)&&(pixel%19)!==1){
       neighbors.push(pixel-1);
      dirChange="left";
    }
    if(contains(pathPixels,pixel-19)&&pixel>19){
       neighbors.push(pixel-19);
      dirChange="up";
    }
    if(contains(pathPixels,pixel+19)&&pixel<342){
       neighbors.push(pixel+19);
       dirChange="down";
    }
    if(getDir!==true){
    return neighbors
    }else{
      return dirChange;
    }
  }
  function checkTouchingTowersPath(x,y,w,h,click){
    for(let i=0;i<towers.length;i++){
      if(towers[i].checkIsIn(x,y,click)||towers[i].checkIsIn(x+w,y,click)||towers[i].checkIsIn(x+w,y+h,click)||towers[i].checkIsIn(x,y+h,click)){
        return true
      }
      //path check is xy in enemypath
    }
    if(contains(enemyPath,pixelPIn(x,y,50,100,456,456,24,24))||
      contains(enemyPath,pixelPIn(x+w,y,50,100,456,456,24,24))||
      contains(enemyPath,pixelPIn(x+w,y+h,50,100,456,456,24,24))||
      contains(enemyPath,pixelPIn(x,y+h,50,100,456,456,24,24))){
        console.log()
        return true
    }
    return false
  }
  function getDirections(pixel, notDir){
    var dirs=[]
    if(contains(pathPixels,pixel+1)&&(pixel%19)!==0){
      if(notDir!=="right"){
      dirs.push("right");
      }
    }
    if(contains(pathPixels,pixel-1)&&(pixel%19)!==1){
      if(notDir!=="left"){
      dirs.push("left");
      }
    }
    if(contains(pathPixels,pixel-19)&&pixel>19){
      if(notDir!=="up"){
      dirs.push("up");
      }
    }
    if(contains(pathPixels,pixel+19)&&pixel<342){
      if(notDir!=="down"){
      dirs.push("down");
      }
    }
    return dirs
  }
  function drawPathPixels(){
    for(let i =0;i<pathPixels.length;i++){
      fill(230, 172, 123, 255);
      strokeWeight(0)
rect(coordsofPixel(pathPixels[i],50,100,456,456,24,24)[0],coordsofPixel(pathPixels[i],50,100,456,456,24,24)[1],24,24)
      if(start===pathPixels[i]){
        fill("black")
        strokeWeight(0)
        textSize(6)
        text("START",coordsofPixel(pathPixels[i],50,100,456,456,24,24)[0]+3,coordsofPixel(pathPixels[i],50,100,456,456,24,24)[1]+10,24,24)
        stroke("black")
        strokeWeight(3)
        fill(28, 179, 75, 0);
        rect(coordsofPixel(pathPixels[i],50,100,456,456,24,24)[0],coordsofPixel(pathPixels[i],50,100,456,456,24,24)[1],24,24)
        stroke("black")
        fill("black");
      }
      if(end===pathPixels[i]){
        fill("black")
        strokeWeight(0)
        textSize(8)
        text("END",coordsofPixel(pathPixels[i],50,100,456,456,24,24)[0]+3,coordsofPixel(pathPixels[i],50,100,456,456,24,24)[1]+10,24,24)
        stroke("black")
        strokeWeight(3)
        fill(28, 179, 75, 0);
        rect(coordsofPixel(pathPixels[i],50,100,456,456,24,24)[0],coordsofPixel(pathPixels[i],50,100,456,456,24,24)[1],24,24)
        stroke("black")
        fill("black");
      }
    }
  }
  function drawPath(){
    for(let i =0;i<enemyPath.length-1;i++){
      stroke(0, 175, 255, 255);
      strokeWeight(2)
      //console.log(i+1)
      line(coordsofPixel(enemyPath[i],62,112,456,456,24,24)[0],coordsofPixel(enemyPath[i],62,112,456,456,24,24)[1],coordsofPixel(enemyPath[i+1],62,112,456,456,24,24)[0],coordsofPixel(enemyPath[i+1],62,112,456,456,24,24)[1])
    
      
    }
  }
  function contains(list,item){
    for(let i = 0;i<list.length;i++){
      if(list[i]==item){
        return(i);
      }
    }
    return false;
  }
  function removeItemFromArray(list,item){
    var newList=[];
    for(let i =0;i<list.length;i++){
      if(list[i]!==item){
        newList.push(list[i])
      }
    }
    return newList;
  }
  function getActiveEnemies(condition){
    var activeEnemies=[]
    for(let i =0;i<enemies.length;i++){
      if(condition=="dead"){
        if(enemies[i].dead===true){
          activeEnemies.push(enemies[i])
        }
      }else{
      if(enemies[i].active===condition){
        activeEnemies.push(enemies[i])
      }
      }
    }
    return activeEnemies;
  }
  
  function drawTowers(){
    for(var i=0;i<towers.length;i++){
      towers[i].draw()
    }
  }
  function useTowers(){
    for(var i=0;i<towers.length;i++){
      towers[i].shootStuff()
    }
  }
  function spawnEnemies(wave){
    var length=fib[floor(wave/10)]/10+(wave*2);
    enemies=[];
    for(let i =0;i<length;i++){
      //enemies.push(new enemy(10+(i*30),10,3,5,15));
      if(i<10){
      enemies.push(new enemy(i*30,50,2+floor(wave/3),1,15));
      }else if(i<25){
        enemies.push(new enemy(i*30,50,4+floor(wave/8),1.5+(0.01*wave),13));
      }else{
        enemies.push(new enemy(i*30,50,7+floor(wave/15),2.5+(0.05*wave),18));
      }
    }
  }
function checkTowerCriteria(x,y){
  if(pInBox(x,y,62,112,432,432)==false){
    return false;
  }else if(checkTouchingTowersPath(x,y,24,24,false)){
    return false
  }else{
    return true;
  }
}
function findTowersWithType(type){
  var count=0
  for(var lucas_isSwearing=0;lucas_isSwearing<towers.length;lucas_isSwearing++){
    if(towers[lucas_isSwearing].type==type){
      count+=1
    }
  }
  let meCookNOw
  return count;
}
function doWave(wave){
  if(enemies.length==0){
    spawnEnemies(wave)
  }else{
    for(let i =0;i<enemies.length;i++){
      enemies[i].draw();
    }
  }
  if(getActiveEnemies(true).length==0 ||getActiveEnemies(true)[getActiveEnemies(true).length-1].pixel!=enemyPath[0]||enemies[enemies.length-1].dead==true){
    if(getActiveEnemies(false).length>0){
    getActiveEnemies(false)[0].x=coordsofPixel(enemyPath[0],50,100,456,456,24,24)[0];
    getActiveEnemies(false)[0].y=coordsofPixel(enemyPath[0],50,100,456,456,24,24)[1];
      getActiveEnemies(false)[0].pixel=enemyPath[0];
       getActiveEnemies(false)[0].active=true;
    }
  }
  if(getActiveEnemies(true).length==0&&getActiveEnemies("dead").length<enemies.length){
    getActiveEnemies(false)[0].x=coordsofPixel(enemyPath[0],50,100,456,456,24,24)[0];
    getActiveEnemies(false)[0].y=coordsofPixel(enemyPath[0],50,100,456,456,24,24)[1];
      getActiveEnemies(false)[0].pixel=enemyPath[0];
       getActiveEnemies(false)[0].active=true;
  }
  for(let i =0;i<enemies.length;i++){
    if(enemies[i].active===true){
      enemies[i].move(enemies[i].pixel,enemyPath[contains(enemyPath,enemies[i].pixel)+1])
    }
    if(pixelPIn(enemies[i].x,enemies[i].y,50,100,456,456,24,24)==enemyPath[enemyPath.length-1]&& enemies[i].dead==false){
        background("red")
    }
    if(enemies[i].dead==false && enemies[i].pixel==enemyPath[enemyPath.length-1]){
      playerHealth-=enemies[i].health;
      enemies[i].dead=true;
    }
  }
  if(getActiveEnemies("dead").length==enemies.length&&enemies.length>0){
    waveHappening=false;
  }
}
  boxes = [];
  if(state==0){
  background(28, 179, 75, 255);
  textSize(40);
  fill(232, 183, 114)
  text("Tower Defense",160,70);
    boxes=[]
    boxes.push(new box(50,150,150,150,color(76, 175, 80, 255),paths[0]))
      boxes.push(new box(205,150,150,150,color(76, 175, 80, 255),paths[1]))
      boxes.push(new box(360,150,150,150,color(76, 175, 80, 255),paths[0]))
      boxes.push(new box(50,305,150,150,color(76, 175, 80, 255),paths[1]))
      boxes.push(new box(205,305,150,150,color(76, 175, 80, 255),paths[0]))
      boxes.push(new box(360,305,150,150,color(76, 175, 80, 255),custom))
    for(let i = 0;i<boxes.length;i++){
      boxes[i].draw()
    }

  
  }else 
    if(state==1){
    background(28, 179, 75, 255);
    strokeWeight(0)
    fill(232, 183, 114)
    if(selectTool!==2){
    textSize(40);
    text("Custom Map",160,70);
    }else{
      textSize(40);
      text("Custom Map",160,50);
      fill("black");
      textSize(20);
      if(errorMessage==-1){
      text("Step "+stepThing+":  "+steps[stepThing-1],140,80)
      }else{
        text(errorMessages[errorMessage],100,80)
  }
      
    }
    fill(28, 179, 75, 255);
    strokeWeight(3)
    rect(50,100,456,456);
      //button 1
    fill(28, 179, 75, 255);
      strokeWeight(3)
      rect(506,100,80,80);
      fill(230, 172, 123);
      strokeWeight(0)
      rect(526,120,40,40);
    if(mouseX>=506 && mouseX<=586 && mouseY>=100 && mouseY<=180 && mouseIsPressed==true){
      selectTool=0
    }

    //button 2
    fill(28, 179, 75, 255);
      strokeWeight(3)
      rect(506,180,80,80);
      fill("black");
      strokeWeight(3)
      quad(556,195,571,210,556,226.5,541,212.5)
    fill("white")
    quad(526,230,541,245,556,226.5,541,212.5)
    if(mouseX>=506 && mouseX<=586 && mouseY>=180 && mouseY<=260 && mouseIsPressed==true){
      selectTool=1
    }

    //button 3
    fill(28, 179, 75, 255);
      strokeWeight(3)
      rect(506,260,80,80);
      fill("black");
      image(edit,521,275,50,50);
    if(mouseX>=506 && mouseX<=586 && mouseY>=260 && mouseY<=320 && mouseIsPressed==true){
      selectTool=2;
      errorMessage=-1;
    }


    //big if thing
    //yeah thats right
    //I am so bad at organizing my code
    if(selectTool==0){
      drawPathPixels();
      fill(230, 172, 123, 100);
      strokeWeight(0)
rect(coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[0],coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[1],24,24)
      if(mouseIsPressed &&pixelPIn(mouseX,mouseY,50,100,456,456,24,24)>0){
        if(contains(pathPixels,pixelPIn(mouseX,mouseY,50,100,456,456,24,24))===false){
        pathPixels.push(pixelPIn(mouseX,mouseY,50,100,456,456,24,24));
        }
      }

      stroke("yellow")
      fill(28, 179, 75, 255);
      strokeWeight(3)
      rect(506,100,80,80);
      stroke("black")
      fill(230, 172, 123);
      strokeWeight(0)
      rect(526,120,40,40);
    
    }
    else if(selectTool==1){
      drawPathPixels();
      fill(28, 179, 75, 100);
      strokeWeight(0)
rect(coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[0],coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[1],24,24)
      if(mouseIsPressed &&pixelPIn(mouseX,mouseY,50,100,456,456,24,24)>0){
        if(contains(pathPixels,pixelPIn(mouseX,mouseY,50,100,456,456,24,24))!==false){
        pathPixels=removeItemFromArray(pathPixels,pixelPIn(mouseX,mouseY,50,100,456,456,24,24));
        }
      }
      stroke("yellow")
      fill(28, 179, 75, 255);
      strokeWeight(3)
      rect(506,180,80,80);
      stroke("black")
      fill("black");
      strokeWeight(3)
      quad(556,195,571,210,556,226.5,541,212.5)
    fill("white")
    quad(526,230,541,245,556,226.5,541,212.5)
    strokeWeight(0)
    }else 
      if(selectTool==2){
      drawPathPixels();
      if(stepThing==1){
        fill("black")
        strokeWeight(0)
        textSize(6)
        text("START",coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[0]+3,coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[1]+10,24,24)
        stroke("black")
        strokeWeight(3)
        fill(28, 179, 75, 0);
        rect(coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[0],coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[1],24,24)
        stroke("black")
        fill("black");
        if(mouseIsPressed &&pixelPIn(mouseX,mouseY,50,100,456,456,24,24)>0){
          if(contains(pathPixels,pixelPIn(mouseX,mouseY,50,100,456,456,24,24))!==false){
            //console.log(pathPixels)
            ///console.log(contains(pathPixels,pixelPIn(mouseX,mouseY,50,100,456,456,24,24)))
            start=pixelPIn(mouseX,mouseY,50,100,456,456,24,24);
            if(start%19==0||start%19==1||start<20||start>342){
              stepThing+=1
              errorMessage=-1
              extraClick=5;
            }else{
              start=-1
              errorMessage=0;
            }
          }else{
            errorMessage=1;
          }
        }
      }
      else if(stepThing==2){
        fill("black")
        strokeWeight(0)
        textSize(8)
        text("END",coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[0]+3,coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[1]+10,24,24)
        stroke("black")
        strokeWeight(3)
        fill(28, 179, 75, 0);
        rect(coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[0],coordsofPixel(pixelPIn(mouseX,mouseY,50,100,456,456,24,24),50,100,456,456,24,24)[1],24,24)
        stroke("black")
        fill("black");


        if(mouseIsPressed &&pixelPIn(mouseX,mouseY,50,100,456,456,24,24)>0){
          if(extraClick==0){
          if(contains(pathPixels,pixelPIn(mouseX,mouseY,50,100,456,456,24,24))!==false){
            //console.log(pathPixels)
            //console.log(contains(pathPixels,pixelPIn(mouseX,mouseY,50,100,456,456,24,24)))
            end=pixelPIn(mouseX,mouseY,50,100,456,456,24,24);
            if((end%19==0&&start%19==1)||(start%19==0&&end%19==1)||(start<20&&end>342)||(start>342&&end<20)){
              stepThing+=1
              errorMessage=-1
            }else{
              end=-1
              errorMessage=2;
            }
          }else{
            errorMessage=1;
          }
        }else{
            extraClick-=1;
        }
        }
      }
      else if(stepThing==3){
        drawPathPixels()
        drawPath();
        if(pathFind(start,end)[0]=="done"){
          stepThing+=1;
        }else if(pathFind(start,end)[0]=="no path"){
          errorMessage=3;
        }else if(pathFind(start,end).length>1){
          errorMessage=4;
        }
        
      }
      
      fill(28, 179, 75, 255);
      stroke("yellow")
      strokeWeight(3)
      rect(506,260,80,80);
      stroke("black")
      fill("black");
      image(edit,521,275,50,50);
      enemyPath[0]=start;
    }

    //add five settings in the toolbar: place a block, erase a block, edit the enemy path, save, and load
    
  }else if(state==2){
    background(28, 179, 75, 255);
    
    textSize(40);
    fill(232, 183, 114)
    text("Wave "+wave,160,70);
    textSize(15);
    fill("black");
    text("Money: "+coins,360,70);
      text("Health: "+playerHealth,480,70);
      strokeWeight(3)
    if(levelmap==1){
      pathPixels=[20,21,22,23,24,25,44,63,82,101,120,139,140,141,142,143,144,163,182,201,220,239,258,259,260,261,262,281,300,319,338,357,358,359,360,361];
      enemyPath=[20,21,22,23,24,25,44,63,82,101,120,139,140,141,142,143,144,163,182,201,220,239,258,259,260,261,262,281,300,319,338,357,358,359,360,361,380]
      
      
    }else if(levelmap==2){
      pathPixels=[2, 21, 40, 59, 78, 97, 116, 135, 154, 173, 192, 211, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 227, 208, 189, 170, 151, 132, 113, 94, 93, 92, 91, 90, 89, 88, 87, 86, 105, 124, 143, 162, 181, 200, 219, 257, 276, 295, 314, 333, 352]
      enemyPath=[2, 21, 40, 59, 78, 97, 116, 135, 154, 173, 192, 211, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 227, 208, 189, 170, 151, 132, 113, 94, 93, 92, 91, 90, 89, 88, 87, 86, 105, 124, 143, 162, 181, 200, 219, 238, 257, 276, 295, 314, 333, 352,371]
    }
    stroke(0,0,0)
    fill(28, 179, 75, 255);
    rect(50,100,456,456);
    stroke(0,0,0,0)
    drawPathPixels();
      if(waveHappening){
      doWave(wave)
      }
      drawTowers()
    if(collapsed){
      fill("black")
      rect(50,556,456,30)
      fill(28, 179, 75, 255);
      rect(52,558,452,26)
      fill("black")
      stroke(0,0,0)
      strokeWeight(5)
      line(468,577,481,562)
      line(481,562,494,577)
      stroke(0,0,0,0)
    }else{
      fill("black")
      rect(50,556,456,200)
      fill(28, 179, 75, 255);
      rect(52,558,452,196)
      fill("black")
      strokeWeight(5)
      line(468,562,481,577)
      line(481,577,494,562)
      textSize(15)
      //noStroke()
      text("Drag a tower onto the map",200,570)
      for(let i=0;i<5;i++){
        image(towerImgs[i],60+(i*70),600)
        if(coins>=towerProperties[i][0]){
          fill("blue")
        }else{
          fill("red")
        }
        
        //stroke("#ADD8E6")
        strokeWeight(3)
        rect(60+(i*70),670,57,20)
        strokeWeight(0)
        fill("yellow")
        textSize(14)
        text("$"+towerProperties[i][0],80+(i*70),685)
      }
      strokeWeight(3)
      if((pInBox(mouseX,mouseY,61,600,350,57)&&mouseIsPressed)){
        if(towerSelected!==false){
          towerSelected.x=mouseX
          towerSelected.y=mouseY
          towerSelected.draw()
        }else{
          if(towerProperties[floor((mouseX-60)/70)][0]<=coins){
          towerSelected=new tower(mouseX,mouseY,1,floor((mouseX-60)/70),24,false);
          }
        }
      }else{
        if(mouseIsPressed&&towerSelected!==false){
          towerSelected.x=mouseX
          towerSelected.y=mouseY
          towerSelected.draw()
        }else{
          if(towerSelected!==false&&!mouseIsPressed){
            if(checkTowerCriteria(towerSelected.x,towerSelected.y)){
              towers.push(towerSelected);
              towers[towers.length-1].placed=true;
              coins-=towerProperties[towerSelected.type][0]
            }
          }
          towerSelected=false
        }
      }
    }
    if(waveHappening){
      useTowers()
      }
      fill("black")
    if(mouseIsPressed&&pInBox(mouseX,mouseY,468,562,494,577)){
      if(clicked==false){
      if(collapsed){
        collapsed=false
      }else{
        collapsed=true;
      }
      clicked=true;
    }
    }else{
      clicked=false;
    }
    strokeWeight(3)
    if(mouseX>=506 && mouseX<=586 && mouseY>=100 && mouseY<=180 && mouseIsPressed==true){
      //
    }
    if(!waveHappening){
      fill("black")
      rect(515,535,60,25)
      fill("white")
      textSize(20)
      text("Next",520,558)
      if(pInBox(mouseX,mouseY,515,535,60,25)&&mouseIsPressed){
        enemies=[];
        for(let evan_is_topg=0;evan_is_topg<towers.length;evan_is_topg++){
          towers[evan_is_topg].lasers=[]
        }
        waveHappening=true;
        wave+=1;
      }
    }
    for(var i=0;i<5;i++){
      if(i==3){
        if(findTowersWithType(3)>=5){
      towerProperties[i][0]=round((towerProperties[i][10]+(findTowersWithType(i)*(towerProperties[i][10]/3))))+((findTowersWithType(3)-4)*30)
        }else{
          towerProperties[i][0]=round((towerProperties[i][10]+(findTowersWithType(i)*(towerProperties[i][10]/3))))
        }
    }else{
        towerProperties[i][0]=round((towerProperties[i][10]+(findTowersWithType(i)*(towerProperties[i][10]/10))))
      }
      console.log(findTowersWithType(4))
    }
  }
  if(mouseIsPressed){
    console.log()
  }
}
//[2, 21, 40, 59, 78, 97, 116, 135, 154, 173, 192, 211, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 227, 208, 189, 170, 151, 132, 113, 94, 93, 92, 91, 90, 89, 88, 87, 86, 105, 124, 143, 162, 181, 200, 219, 238, 257, 276, 295, 314, 333, 352]