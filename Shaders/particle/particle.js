var VERSION = "400 core";
var MAX_LIGHTS = 4;
var SHADER;

//This function is called on initialization of this shader object.
function init(shader){
    SHADER = shader;
}
//This function is to get the VERSION variable.
function getVersion(){
    return VERSION;
}

//Add Attribute variables here, these variables are the types associated with a VAO
//Each Attribute needs a "name" element, and a "type" element
//Variable types are (vec2, vec3, mat4, float)
//If an array is required, add the element (array=(number))
//These attributes will end up as 'in' variables in the Vertex Shader
function getAttributes(){
   var attributes=[
       {
           "type":"vec3",
           "name":"position"
       },
       {
           "type":"vec2",
           "name":"textureCoords"
       },
       {
           "type":"vec3",
           "name":"normal"
       },
       {
           "type":"vec3",
           "name":"tangent"
       },
       {
           "type":"vec3",
           "name":"bitangent"
       }
   ];
   return attributes;
}

//Add Attribute variables here, these variables are the types associated with a VAO
//Each Attribute needs a "name" element, and a "type" element
//Variable types are (vec2, vec3, mat4, float)
//If an array is required, add the element (array=(number))
//These attributes will end up as 'out' variables in the Vertex Shader and 'in' variables in the fragment shader.
function getPassAttributes(){
   var pass=[
       {
           "type":"vec2",
           "name":"pass_textureCoords"
       },
       {
           "type":"vec3",
           "name":"toCameraVector"
       },
       {
           "type":"vec3",
           "name":"toLightVector",
           "array":MAX_LIGHTS
       }
   ];
   return pass;
}

//Add Uniform variables here, they simply need to exist either in the Vertex or Fragment Shader
//Each uniform needs a "name" element, a "location" element, and a "type" element
//Location tells java which shader to put each attribute into "vertex", or "fragment"
//Variable types are (float, vec3, mat4, sampler2D)
//If an array is required, add the element (array=(number))
function getUniforms(){
   var uniforms=[
       {
           "type":"mat4",
           "name":"transformationMatrix",
           "location":"vertex"
       },
       {
           "type":"mat4",
           "name":"projectionMatrix",
           "location":"vertex"
       },
       {
           "type":"mat4",
           "name":"viewMatrix",
           "location":"vertex"
       },
       {
           "type":"mat4",
           "name":"rotationMatrix",
           "location":"vertex"
       },
       {
           "type":"vec3",
           "name":"lightPosition",
           "location":"vertex",
           "array":MAX_LIGHTS
       },
       {
           "type":"vec3",
           "name":"lightColor",
           "location":"fragment",
           "array":MAX_LIGHTS
       },
       {
           "type":"vec3",
           "name":"attenuation",
           "location":"fragment",
           "array":MAX_LIGHTS
       },
       {
           "type":"vec2",
           "name":"textureScale",
           "location":"vertex"
       },
       {
           "type":"vec2",
           "name":"textureIndex",
           "location":"vertex"
       },
       {
           "type":"sampler2D",
           "name":"albedoMap",
           "location":"fragment"
       }
   ];
   return uniforms;
}

function loadLights(lights){
    for(var i = 0; i < MAX_LIGHTS; i++){
        if(i < lights.length) {
            SHADER.loadData("lightPosition[" + i + "]", lights[i].getPosition());
            SHADER.loadData("lightColor[" + i + "]", lights[i].getColor());
            SHADER.loadData("attenuation[" + i + "]", lights[i].getAttenuation());
        }else{
            SHADER.loadData("lightPosition[" + i + "]", new Vector3f(0, 0, 0));
            SHADER.loadData("lightColor[" + i + "]", new Vector3f(0, 0, 0));
            SHADER.loadData("attenuation[" + i + "]", new Vector3f(1, 0, 0));
        }
    }
}
