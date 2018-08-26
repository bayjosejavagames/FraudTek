#version 400 core

in vec3 position;
in vec2 textureCoords;
in vec3 normal;
in vec3 tangent;
in vec3 bitangent;

out vec2 pass_textureCoords;
out vec3 toLightVector[4];
out vec3 toCameraVector;
out vec3 passNormal;


uniform mat4 transformationMatrix;
uniform mat4 rotationMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec3 lightPosition[4];
uniform vec2 textureScale;
uniform vec2 textureIndex;


void main(void){
    vec4 worldPosition = transformationMatrix * vec4(position, 1.0);
    gl_Position =  projectionMatrix * viewMatrix * worldPosition;

    pass_textureCoords = (textureCoords * textureScale) + (textureIndex * textureScale);

    for(int i = 0; i < 4; i++){
        toLightVector[i] = lightPosition[i] - worldPosition.xyz;
    }
    toCameraVector = (inverse(viewMatrix) * vec4(0.0,0.0,0.0,1.0)).xyz - worldPosition.xyz;
    passNormal = (rotationMatrix * vec4(normal, 1.0)).xyz;
}
