export const vertexShader = `
#include <common>

uniform float uTime;
uniform float uRadius;
uniform vec3 uBallPosition;
uniform float uSpeed[500];

varying float vDistance;

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}

void main() {
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 2.0);
  float size = distanceFactor * 0.05 + 10.0;

  vec3 particlePosition = position * rotation3dY(uTime * distanceFactor * uSpeed[gl_VertexID / 3]);
  particlePosition += uBallPosition;

  vDistance = distanceFactor;

  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = size;
  // Size attenuation;
  gl_PointSize *= (1.0 / - viewPosition.z);
}
`;
