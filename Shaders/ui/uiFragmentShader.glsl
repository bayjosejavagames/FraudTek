#version 400 core

in vec2 textureCoords;

uniform sampler2D guiTexture;

out vec4 out_Color;

void main(void){
    vec4 color = texture(guiTexture, textureCoords);
    out_Color = color;
}