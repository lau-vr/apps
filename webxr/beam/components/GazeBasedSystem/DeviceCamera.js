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
  var rig = document.getElementById("rig");
  var camera = document.getElementById("camera");
  var device = getDevice();
  if (device === "Desktop") {
    camera.setAttribute("position", "0 1.7 0");
    camera.setAttribute("look-controls", "pointerLockEnabled: false;");
    var cursorEntity = document.createElement("a-entity");
    cursorEntity.setAttribute("cursor", "");
    cursorEntity.setAttribute("position", "0 0 -0.1");
    cursorEntity.setAttribute("geometry", `primitive: sphere; radius: 0.0015;`);
    cursorEntity.setAttribute(
      "material",
      "color: #000; shader: flat; opacity: 0.6"
    );
    camera.appendChild(cursorEntity);
  } else if (device === "Mobile") {
    camera.setAttribute("position", "0 1.68 0");
    camera.setAttribute("kinematic-body", "radius: 0.3");
    camera.setAttribute("look-controls", "pointerLockEnabled: false;");
    camera.setAttribute("wasd-controls", "acceleration: 200");
    var cursorEntity = document.createElement("a-entity");
    cursorEntity.setAttribute("cursor", "");
    cursorEntity.setAttribute("position", "0 0 -0.6");
    cursorEntity.setAttribute("geometry", `primitive: sphere; radius: 0.004;`);
    cursorEntity.setAttribute(
      "material",
      "color: #000; shader: flat; opacity: 0.6"
    );
    camera.appendChild(cursorEntity);

    createTeleport("left-teleport", "-2.2 0.3 -1.7", rig, "-2.2 0 -1.7");
    createTeleport("right-teleport", "3.2 0.3 -1.7", rig, "3.2 0 -1.7");
    createTeleport("center-up-teleport", "0.5 0.3 -3", rig, "0.5 0 -3");
    createTeleport("center-down-teleport", "0.5 0.3 1.5", rig, "0.5 0 1.5");
  } else {
    var play = document.getElementById('play')
    play.setAttribute('visible', false)
    rig.setAttribute("kinematic-body", "radius: 0.4");
    rig.setAttribute("movement-controls", "speed: 0.1");
    rig.setAttribute("position", "0.5 0.7 3");


    camera.setAttribute("look-controls", "pointerLockEnabled: false;");
  }
});

const createTeleport = (id, position, camera, cameraPos) => {
  let teleportationArea = document.createElement("a-entity");
  teleportationArea.setAttribute("id", id);
  teleportationArea.setAttribute("gltf-model", "#teleportationArea");
  teleportationArea.setAttribute("modify-materials", "");
  teleportationArea.setAttribute("scale", "0.065 0.065 0.065");
  teleportationArea.setAttribute("position", position);
  teleportationArea.setAttribute(
    "animation",
    "property: scale; to: 0.075 0.075 0.075; dur: 2000; startEvents: mouseenter;"
  );
  teleportationArea.setAttribute(
    "animation__2",
    "property: scale; to: 0.035 0.035 0.035; dur: 200; startEvents: mouseleave;"
  );

  AFRAME.scenes[0].appendChild(teleportationArea);

  var stillHovering = false;

  teleportationArea.addEventListener("mouseenter", () => {
    stillHovering = true;
    setTimeout(function () {
      if (stillHovering) camera.setAttribute("position", cameraPos);
    }, 2000);
  });

  teleportationArea.addEventListener("mouseleave", () => {
    stillHovering = false;
  });

  return teleportationArea;
};
