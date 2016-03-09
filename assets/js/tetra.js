
/**
 * Common tetra object
 */

function Tetra(){}




/**
* Common utils 
*/

Tetra.Utils={};


/**
 * generate a random hexadecimal string
 */

Tetra.Utils.randString = function(){
       return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}


/**
 * get Position for the current tetrahedron object
 * @param  {int} n          cursor position in 
 * @param  {int} colLenght  lines per Columns
 * @param  {int} lineLenght  object per lines
 * @return {array}            [description]
 */

Tetra.Utils.getCoordVal= function(n,colLenght,lineLenght,total) {

  var select= new Tetra.Input('mathFunctionsSelect');
  var funcName=select.val();
  var func=Tetra.Math.pos[funcName];

  var result =func(n,colLenght,lineLenght,total);
  return result;
};




Tetra.Utils.getHash = function(){
   var hash = window.location.hash;
   if(hash) return hash.substring(1);
   else return null;
};


Tetra.Utils.setHash = function(hash){
   window.location.hash=hash;
};

/**
 * rotate each shapes
 * @param  {array} svgArray 
 * @return {void}          
 */

Tetra.Utils.rotateAll= function (svgArray) {
  svgArray.forEach(function(elt){
      var orientation=Tetra.Utils.getCoordVal(elt.cursorPosition,
                                              elt.globalColLength,
                                              elt.globalLineLength,
                                              elt.totalT
                                              );
      elt.rotate(orientation);
  });

  
}



Tetra.Utils.isNumber=function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

/**
 * reverse each shapes to initial poistion
 * @param  {array} svgArray 
 * @return {void}          
 */

Tetra.Utils.reverseAll= function (svgArray) {
  svgArray.forEach(function(elt){
      elt.initial();
  });

  
}


Tetra.Utils.saveSVG = function (element) {
          var serializer = new XMLSerializer();
          var serializedSVG=serializer.serializeToString( element );
          var svg_blob = new Blob([serializedSVG],{'type': 'image/svg+xml'});
          var url = URL.createObjectURL(svg_blob);
          return url;
};


















/**
* SVG Manager 
*/

Tetra.SVG=function(params){

  /** default params configuration and overriding */
  this._p={
    targetId:'convertedSVG',
    canvasID:'mainCanvas',
    targetSVG:null
  };

  for (var key in params) this._p[key]=params[key];

  /**
   * Get all SVG canvas contents and put it in common SVG element at the same position
   * @return {object} the SVG DOM element
   */
  
  this.combineSVG =  function(){

         var targetId  = this._p.targetId, 
             canvasID  = this._p.canvasID,
             targetSVG = !this._p.targetSVG ? document.querySelector('#'+targetId) : this._p.targetSVG ; 
        
         var svgCanvas = document.querySelectorAll('#'+canvasID+' svg');
         targetSVG.innerHTML='';



         targetSVG.setAttribute('width',window.innerWidth);
         targetSVG.setAttribute('height',window.innerHeight);



          var bodyStyle=window
                .getComputedStyle(document.getElementsByTagName('body')[0]);
          var bgColor=bodyStyle.backgroundColor;

          //console.log(bgColor);

          var background=  document.createElementNS('http://www.w3.org/2000/svg','rect');
          background.setAttribute('style','fill:'+bgColor+';');
          background.setAttribute('x',"0");
          background.setAttribute('y',"0");
           
          background.setAttribute('width',window.innerWidth);
          background.setAttribute('height',window.innerHeight);

          targetSVG.appendChild(background);

         for(var index in svgCanvas){
                var shape = svgCanvas[index];

                if(typeof shape == 'object'){
                  var elt=shape;

                  if(elt){

                          var group =  document.createElementNS(Tetra.SVG.url,'g');
                          var paths=elt.getElementsByTagName('path') ;
                          var length=paths.length;
                          console.log(length)

                          for(var i=0;i<length;i++){
                             var path=document.createElementNS(Tetra.SVG.url,'path');
                            path.setAttributeNS(null,'d',paths[i].getAttribute('d'));
                            path.setAttributeNS(null,'style',paths[i].getAttribute('style'));
                             group.appendChild(path);
                         }
                         

                          


                          bound=shape.getBoundingClientRect();
                          group.setAttribute('id','shape-'+index);
                          group.setAttribute('transform','translate('+bound.left+','+bound.top+')');
                          group.setAttribute('opacity',shape.style.opacity);

                          targetSVG.appendChild(group);
                        }
                }
          }


        return targetSVG;

    };

    /**
     * Generating target SVG and make it downloadable
     * @param  {event} event the current onclick event
     * @return {void}
     */
    
    this.combineSVGAndSave = function(event){
        event.currentTarget.download = 'canvas-'+Tetra.Utils.randString()+'.svg';
        var svg= inst.combineSVG();
        event.currentTarget.href     =  Tetra.Utils.saveSVG(svg);
    }

    var inst=this;
    return this;
};


Tetra.SVG.url = 'http://www.w3.org/2000/svg';


/**
 * Create de SVG canvas element
 * @param  {number} width 
 * @param  {number} height
 * @return {object}        the empty SVG DOM Element
 */
Tetra.SVG.createSVG=function(width,height){
  
    var xmlns    = 'http://www.w3.org/2000/svg',
        svg      =  document.createElementNS (xmlns, 'svg');
  
   svg.canvasId = 'canvas-'+ Tetra.Utils.randString();
        
   if(width!=null)
    svg.setAttribute('width', width);

   if(height!=null)
    svg.setAttribute('height', height);

   svg.setAttribute('id', svg.canvasId);

   return svg;
};



















/**
 *  Input Object
 */

Tetra.Input=function(id){
    this.element=document.querySelector('#'+id);
    return this;
};

Tetra.Input.prototype.val=function(){
  return this.element.value;
};












/**
* AnimationFrame Management
*/

Tetra.Frame=function(){};

Tetra.Frame._loopQueue=new Array();
Tetra.Frame._playing = false;
Tetra.Frame._started = false;


Tetra.Frame.start=function(){
      Tetra.Frame._playing = true;
      if(!Tetra.Frame._started){
            Tetra.Frame._started = true;
            Tetra.Frame._loop();
       }

      
};



Tetra.Frame.stop=function(){
    Tetra.Frame._playing = false;
}


Tetra.Frame.onLoop=function(func){
     Tetra.Frame._loopQueue.push(func);
}


Tetra.Frame._animationFrame=function(callback){
  return  window.requestAnimationFrame (callback)        ||
          window.webkitRequestAnimationFrame (callback)  ||
          window.mozRequestAnimationFrame      ||
          function( callback ){
              setTimeout(callback, 1000 / 60);
          };
};


Tetra.Frame._loop=function(){
    if(Tetra.Frame._playing){
         Tetra.Frame._animationFrame(Tetra.Frame._loop);
         Tetra.Frame._loopQueue.forEach(function(func, index){
                func();
         });
    }
 
};

















/**
* Dynamic CSS
*/

Tetra.CSS = function(){};
Tetra.CSS._styleQueue = '';

Tetra.CSS.injectScript=function(stStyle){
  Tetra.CSS._styleQueue+=stStyle;
};

Tetra.CSS.setUpStyleNode=function(){
         var  head = document.head || document.getElementsByTagName('head')[0],
              style = document.createElement('style');
              style.type = 'text/css';

              if (style.styleSheet){
                  style.styleSheet.cssText = Tetra.CSS._styleQueue;
              } else {
                  style.appendChild(document.createTextNode(Tetra.CSS._styleQueue));
              }
              head.appendChild(style);
};