console.log("Connecting to server...");

const VERTEX_SHADER_SRC = `
  uniform vec2 u_view;
  uniform vec2 u_position;

  attribute vec2 a_position;
  
  void main() {
    gl_Position = vec4(u_view + u_position + a_position, 0.0, 1.0);
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
  const vertices = [
    -0.02, -0.02,
     0.02, -0.02,
    -0.02,  0.02,
     0.02,  0.02
  ];
  let t = 0;
  let view = { x: -1.0, y: -1.0 };
  setInterval(() => {
    t += 0.060;
    view.x = Math.sin(t / 4) * 0.5;
    view.y = Math.cos(t / 4) * 0.5;
    setupFruit(program, vertices, view);
    drawFruit(program, [ 0.1,  0.1], vertices);
    drawFruit(program, [-0.1, -0.1], vertices);
  }, 1000/60);
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

function setupFruit(program, vertices, view) {
  // Clear canvas
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  // u_view
  const u_view = gl.getUniformLocation(program, "u_view");
  gl.uniform2f(u_view, view.x, view.y);
}

function drawFruit(program, position, vertices) {
  drawObject(program, position, 2, [0.333, 0.666, 1.000], vertices);
}

function drawObject(program, position, coordDimensions, colors, vertices) {
  // a_position
  const a_position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, coordDimensions, gl.FLOAT, false, 0, 0);

  // u_color
  const u_color = gl.getUniformLocation(program, "u_color");
  gl.uniform3f(u_color, ...colors);

  // u_position
  const u_position = gl.getUniformLocation(program, "u_position");
  gl.uniform2f(u_position, ...position);

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

