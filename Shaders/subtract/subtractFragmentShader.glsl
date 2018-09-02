#version 400 core

in vec2 pass_TextureCoords;

uniform sampler2D originalTexture;
uniform sampler2D subtractTexture;

out vec4 out_Color;

void main(void){
    out_Color = vec4(0.0);
    out_Color.xyz = ((texture(originalTexture, pass_TextureCoords).xyz - texture(subtractTexture, pass_TextureCoords).xyz));
}
