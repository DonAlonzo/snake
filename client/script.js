console.log("Connecting to server...");

const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  
  uniform vec3 u_color;
  
  void main() {
    gl_FragColor = vec4(u_color, 1.0);
  }
`;

window.onload = main;

function main() {
  const canvas = document.getElementById("canvas");
  window.gl = canvas.getContext("webgl");
  const program = buildProgram(VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC);
  drawFruit(program);
}

function drawFruit(program) {
  gl.useProgram(program);
  drawObject(program, 2, [0.333, 0.666, 1.000], [
    -0.5, -0.5,
     0.5, -0.5,
    -0.5,  0.5,
     0.5,  0.5
  ]);
}

function buildShader(type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function buildProgram(vertexShaderSrc, fragmentShaderSrc) {
  const program = gl.createProgram();
  gl.attachShader(program, buildShader(gl.VERTEX_SHADER, vertexShaderSrc));
  gl.attachShader(program, buildShader(gl.FRAGMENT_SHADER, fragmentShaderSrc));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error("Could not link the program.");
  }
  return program;
}

function drawObject(program, coordDimensions, colors, vertices) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // a_position
  const a_position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, coordDimensions, gl.FLOAT, false, 0, 0);

  // u_color
  const u_color = gl.getUniformLocation(program, "u_color");
  gl.uniform3f(u_color, ...colors);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / coordDimensions);
}

const ws = new WebSocket("ws://boman.io:3000/asdasd");

ws.onopen = () => {
  console.log("Connected to server.");

  ws.send("Hey hey hey");
};

ws.onmessage = message => {
  console.log(message);
};

ws.onerror = error => {
  console.error(error);
};

