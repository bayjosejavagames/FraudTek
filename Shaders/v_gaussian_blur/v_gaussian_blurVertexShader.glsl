#version 400 core

in vec3 position;
in vec2 textureCoords;
in vec3 normal;
in vec3 tangent;
in vec3 bitangent;

out vec2 blurTextureCoords[11];

uniform float targetWidth;
uniform float blurDivide;

void main(void){
    gl_Position = vec4(position.z , position.x, 0.0, 1.0);

    float pixelSize = (1.0 / targetWidth)/blurDivide;

    for(int i = -5; i <=5 ;i++){
        blurTextureCoords[i+5] = textureCoords + vec2(0.0, pixelSize * i);
    }

}
