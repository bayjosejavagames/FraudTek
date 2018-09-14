#version 400 core

in vec3 position;
in vec2 textureCoords;
in vec3 normal;
in vec3 tangent;
in vec3 bitangent;

out vec2 pass_textureCoords;
out vec3 toLightVector[@MAX_LIGHTS];
out vec3 toCameraVector;
out vec3 passNormal;
out mat3 TBN;

uniform mat4 animationMatrix;
uniform mat4 transformationMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec3 lightPosition[@MAX_LIGHTS];

void main(void){
    vec4 worldPosition = animationMatrix * transformationMatrix * vec4(position, 1.0);

    mat4 rotationMatrix = mat4(transformationMatrix[0], transformationMatrix[1], transformationMatrix[2], vec4(0.0, 0.0, 0.0, 1.0));

    gl_Position =  projectionMatrix * viewMatrix * worldPosition;
    pass_textureCoords = textureCoords;

    for(int i = 0; i < @MAX_LIGHTS; i++){
        toLightVector[i] = lightPosition[i] - worldPosition.xyz;
    }
    toCameraVector = (inverse(viewMatrix) * vec4(0.0,0.0,0.0,1.0)).xyz - worldPosition.xyz;
    passNormal = (rotationMatrix * vec4(normal, 1.0)).xyz;

	TBN = transpose(mat3((rotationMatrix * vec4(tangent, 1.0)).xyz, (rotationMatrix * vec4(bitangent, 1.0)).xyz, passNormal));
}
