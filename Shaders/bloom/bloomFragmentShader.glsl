#version 400 core

in vec2 pass_textureCoords;

uniform vec3 bloomColor;

out vec4 out_Color;

void main(void){
    out_Color = vec4(bloomColor, 0.0);
}
