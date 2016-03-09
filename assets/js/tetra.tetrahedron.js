/**
* Tetrahedron generation
* @param  {String} canvasId the id of created SVG canvas
* @return {object}          extended DOM SVG element
*/


Tetra.Tetrahedron=function(width,height){

    /**
     * Object static vars
     */
    
    var interval =3000;

    var hexColors = [0x000000,0x666666,0xeeeeee];


    /**
     * Three scene & camera generation
     */

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

    camera.position.y = width/2;
    camera.position.z = height/2;
    
    /**
     * tetrahedron geometry
     */
    
    var geometry = new THREE.TetrahedronGeometry(width/3.1);
    
    this.coloring=function(colors){
         for ( var i = 0; i < geometry.faces.length; i += 2 ) {
                  geometry.faces[ i ].color.setHex( colors[i] );
                  geometry.faces[ i + 1 ].color.setHex( colors[i] );
            }

    }

    this.coloring(hexColors);
   

    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
    var tetrahedron = new THREE.Mesh( geometry, material );
   

    tetrahedron.position.y=(height/2);



    scene.add(tetrahedron);

    var ambient = new THREE.AmbientLight( 0x80ffff );
    scene.add( ambient );

    var directional = new THREE.DirectionalLight( 0xffff00 );
    directional.position.set( - 1, 0.5, 0 );
    scene.add( directional );


    var renderer = new THREE.SVGRenderer();
    renderer.setQuality( 'hight' );
    renderer.setSize( width, height);
    renderer.setClearColor( 0xcccccc);
    

  
    var canvas=renderer.domElement;

  


  /**
   * object public methods
   */
  
    canvas.render=function(){
      renderer.render( scene, camera );
    }

    canvas.rotate=function(orientation){

        var target ={x:orientation[0],y:orientation[1],z:orientation[2]};
        var position = {x:tetrahedron.rotation.x,y:tetrahedron.rotation.y,z:tetrahedron.rotation.z};
      
        var tween = new TWEEN.Tween(position).to(target,3000)
        tween.easing(TWEEN.Easing.Cubic.In)


        function update(p1){    
            if(Tetra.Utils.isNumber(position.x) && Tetra.Utils.isNumber(position.y))
                {
                    tetrahedron.rotation.z = position.z;
                    tetrahedron.rotation.x = position.x;
                    tetrahedron.rotation.y = position.y;
                    
                    canvas.render();
                }

        }

        tween.onUpdate(update);
        tween.start();
        Tetra.Frame.onLoop(tween.update);
    }


  canvas.verbose = false;
  return canvas;

};