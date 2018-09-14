#version 400 core

in vec2 pass_textureCoords;
in vec3 toCameraVector;
in vec3 toLightVector[@MAX_LIGHTS];
in vec3 passNormal;
in mat3 TBN;

out vec4 out_Color;

uniform sampler2D albedoMap[@MAX_TEXTURES_PER_ENTITY];
uniform sampler2D ambientOcclusionMap;
uniform sampler2D normalMap;
uniform sampler2D displacementMap;
uniform sampler2D reflectionMap;
uniform sampler2D roughnessMap;
uniform sampler2D emissiveMap;
uniform sampler2D emissivemaskMap;

uniform vec3 lightColor[@MAX_LIGHTS];
uniform vec3 attenuation[@MAX_LIGHTS];
uniform float shineDamper;
uniform float reflectivity;

const float levels = 5.0;

void main(void){
    vec4 albedoColor = texture(albedoMap[0], pass_textureCoords);
    vec4 ambientOcclusionMap = texture(ambientOcclusionMap, pass_textureCoords);
    vec4 normalColor = texture(normalMap, pass_textureCoords);
    vec3 normalMapVector = normalize(normalColor.rgb*2.0 - 1.0);
    vec4 roughnessColor = texture(roughnessMap, pass_textureCoords);
    vec4 emissiveColor = texture(emissiveMap, pass_textureCoords);
    vec4 emissiveMaskColor = texture(emissivemaskMap, pass_textureCoords);

    vec3 unitVectorToCamera = normalize(toCameraVector);     //Unit Vector to camera
    vec3 unitNormal = normalize(passNormal);         //Unit Normal
    normalMapVector = (TBN * normalize(normalMapVector)) * vec3(1.0, 1.0, -1.0);

    vec3 displacement = texture(displacementMap, pass_textureCoords).xyz * unitNormal * -1;

    vec3 totalDiffuse = vec3(0.0);
    vec3 totalSpecular = vec3(0.0);
    vec3 totalAmbient = vec3(0.0);

    for(int i = 0; i < @MAX_LIGHTS; i++){
        float distance = length(toLightVector[i]);
        float attFactor = attenuation[i].x + (attenuation[i].y * distance) + (attenuation[i].z * distance * distance);
        float nDot = dot(normalize(toLightVector[i]), unitNormal);

        float brightness = max(nDot, 0.0);
        float level = floor(brightness * levels);
        brightness = level / levels;
        totalDiffuse = totalDiffuse + ((lightColor[i] / attFactor * brightness));

        float specularAddition = (dot(reflect(-normalize(toLightVector[i]), normalize(unitNormal)), unitVectorToCamera));
        specularAddition = max(specularAddition, 0.0);
        specularAddition = min(specularAddition, 1.0);
        float dampedSpecular = pow(specularAddition, 1000)/ attFactor;
        totalSpecular = clamp(totalSpecular + (lightColor[i] * dampedSpecular), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));

        totalAmbient = totalAmbient + ((lightColor[i] / (attFactor * distance)));
    }


    totalDiffuse = max(totalDiffuse, 0.0);
    totalDiffuse = min(totalDiffuse, 1.0);

    totalSpecular = max(totalSpecular, 0.0);
    totalSpecular = min(totalSpecular, 1.0);


    if(albedoColor.a<0.5){
        discard;
    }

    out_Color = (clamp(emissiveMaskColor * emissiveColor, vec4(0.0, 0.0, 0.0, 0.0), vec4(1.0, 1.0, 1.0, 1.0)) + clamp((albedoColor * (vec4(totalDiffuse + (totalAmbient), 1.0)) ), vec4(0.0, 0.0, 0.0, 0.0), vec4(1.0, 1.0, 1.0, 1.0)));

//      out_Color = vec4(totalDiffuse, 1.0);
//      out_Color = vec4(totalAmbient, 1.0);
//        out_Color = vec4(totalAmbient, 1.0);

//    out_Color = vec4(passNormal, 1.0);
//    out_Color = vec4(normalMapVector, 1.0);
}
