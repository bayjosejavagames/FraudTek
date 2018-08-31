#version 400 core

in vec3 position;
in vec2 textureCoords;
in vec3 normal;
in vec3 tangent;
in vec3 bitangent;

out vec2 pass_textureCoords;

uniform mat4 transformationMatrix;
uniform vec2 guiScale;

void main(void){
	gl_Position = transformationMatrix * vec4(position.x * guiScale.x, position.z * guiScale.y, 0.0, 1.0);
	pass_textureCoords = textureCoords;
}