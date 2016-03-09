


/**
* Math 
*/

Tetra.Math=function(){};

/**
 * simple fibonnacci function   
 * @param  {int} n current cursor position 
 * @return {int}   result for cursor position
 */
Tetra.Math.algo={};
Tetra.Math.algo.fibonnacci=function (n) {
       var w, u = 0,v = 1;
       if(n <= 0) return 0; if(n == 1)return 1;
       for(var i=2; i <= n; i++) { w = u+v; u = v; v = w; };
       return v;
};

Tetra.Math.pos=new Array;

Tetra.Math.pos.initial=function(){
    return [0.5,0.2,0.1];
};

Tetra.Math.pos.linear=function(n,lengthX,lengthY,totalT){
   var current=(n/totalT)*1.5;
   var result= [current,current,current];
   return result;
};

Tetra.Math.pos.parabolic=function(n,lengthX,lengthY,totalT){
  var current=n/(totalT/4);
  return [0,current,0.2];
};

Tetra.Math.pos.random=function(n,lengthX,lengthY,totalT){
  var currentX =Math.random()*3;
  var currentY = Math.random()*3;
  var currentZ = Math.random()*3;

  var result = [currentX,currentY,currentZ];
  return result
};

