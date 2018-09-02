#version 400 core

in vec3 position;
in vec2 textureCoords;
in vec3 normal;
in vec3 tangent;
in vec3 bitangent;

out vec2 pass_TextureCoords;

void main(void){
    gl_Position = vec4(position.z , position.x, 0.0, 1.0);
    pass_TextureCoords = textureCoords;
}
