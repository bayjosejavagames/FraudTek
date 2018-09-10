#version 400 core

in vec2 pass_TextureCoords;

uniform sampler2D originalTexture;
uniform sampler2D subtractTexture;

out vec4 out_Color;

void main(void){
    out_Color = vec4(0.0);

    vec3 tex1 = texture(originalTexture, pass_TextureCoords).xyz;
    vec3 tex2 = texture(subtractTexture, pass_TextureCoords).xyz;

    out_Color.xyz = (tex1 - (tex2 * vec3(1.5)));
}
