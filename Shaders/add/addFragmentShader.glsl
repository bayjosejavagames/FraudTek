#version 400 core

in vec2 pass_TextureCoords;

uniform sampler2D textureOne;
uniform sampler2D textureTwo;

out vec4 out_Color;

void main(void){
    out_Color = vec4(1.0);
    vec4 sceneColor = texture(textureOne, pass_TextureCoords);
    vec4 highlightColor = texture(textureTwo, vec2(1.0 - pass_TextureCoords.x, 1.0 - pass_TextureCoords.y));
    float intensity = (highlightColor.r + highlightColor.g + highlightColor.b)/3;
    if(intensity > 0){
        out_Color.xyz = ((1.0 - intensity) * sceneColor.xyz) + (highlightColor.xyz);
    }else{
        out_Color = sceneColor;
    }
}
