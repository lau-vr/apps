export function getDevice() {
  if (navigator.userAgent.indexOf("OculusBrowser") !== -1) {
    return "OculusBrowser";
  } else if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return "Mobile";
  } else {
    return "Desktop";
  }
}

window.addEventListener("load", (event) => {
  var device = getDevice();

  var rig = document.createElement("a-entity");
  rig.setAttribute("id", "rig");
  rig.setAttribute("position", "0 0 0.2");
  var camera = document.createElement("a-entity");
  camera.setAttribute("camera", "");
  camera.setAttribute("id", "camera");
  var barHolder = document.createElement("a-entity");
  barHolder.setAttribute("id", "barHolder")
  barHolder.setAttribute("position", "1 1 -2");

  if (device !== "Mobile") {
    rig.setAttribute("kinematic-body", "radius: 0.3");
    rig.setAttribute("movement-controls", "speed: 0.2");
    camera.setAttribute("position", "0 1.8 0");
    camera.setAttribute("look-controls", "pointerLockEnabled: false;");
    var cursorEntity = document.createElement("a-entity");
    cursorEntity.setAttribute("id", "cursor");
    cursorEntity.setAttribute("cursor", "");
    cursorEntity.setAttribute("position", "0 0 -0.1");
    cursorEntity.setAttribute("geometry", `primitive: sphere; radius: 0.0015;`);
    cursorEntity.setAttribute(
      "material",
      "color: #000; shader: flat; opacity: 0.6"
    );
    cursorEntity.appendChild(barHolder);
    camera.appendChild(cursorEntity);
    rig.appendChild(camera);
    AFRAME.scenes[0].appendChild(rig);
  } else {
    camera.setAttribute("position", "0 1.8 0");
    camera.setAttribute("kinematic-body", "radius: 0.3");
    camera.setAttribute("look-controls", "pointerLockEnabled: false;");
    camera.setAttribute("wasd-controls", "acceleration: 200");
    var cursorEntity = document.createElement("a-entity");
    cursorEntity.setAttribute("id", "cursor");
    cursorEntity.setAttribute("cursor", "");
    cursorEntity.setAttribute("position", "0 0 -0.6");
    cursorEntity.setAttribute("geometry", `primitive: sphere; radius: 0.006;`);
    cursorEntity.setAttribute(
      "material",
      "color: #000; shader: flat; opacity: 0.6"
    );

    cursorEntity.appendChild(barHolder);
    camera.appendChild(cursorEntity);
    rig.appendChild(camera);
    AFRAME.scenes[0].appendChild(rig);
  }
  // } else {
  //   camera.setAttribute(
  //     "orbit-controls",
  //     "target: 0 1 -1.4; initialPosition: -0.5 1.4 0.3; minDistance: -0.01; enableZoom: false;"
  //   );

  //   AFRAME.scenes[0].appendChild(camera);
  // }
});
