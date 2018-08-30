#version 400 core

in vec2 textureCoords;

uniform sampler2D guiTexture;

out vec4 out_Color;

void main(void){
    vec4 color = texture(guiTexture, textureCoords);
    if(color.a < 0.5){
        discard;
    }
    out_Color = color;
}