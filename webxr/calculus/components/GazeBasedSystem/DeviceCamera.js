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
  var rig = document.createElement("a-entity");
  rig.setAttribute("id", "rig");
  rig.setAttribute("position", "0 0 0.2");
  var camera = document.createElement("a-entity");
  camera.setAttribute("camera", "");
  camera.setAttribute("id", "camera");
  var device = getDevice();
  if (device === "Desktop") {
    rig.setAttribute("kinematic-body", "radius: 0.3");
    // rig.setAttribute("wasd-controls", "acceleration: 200");
    rig.setAttribute("movement-controls", "speed: 0.2");
    camera.setAttribute("position", "0 1.6 0");
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
    rig.appendChild(camera);
    AFRAME.scenes[0].appendChild(rig);
  } else if (device === "Mobile") {
    camera.setAttribute("position", "0 1.6 0");
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

    createTeleport("left-teleport", "-1.5 0.1 -2", rig, "-1.5 0 -2");
    createTeleport("right-teleport", "1.9 0.1 -2", rig, "1.9 0 -2");
    createTeleport("center-up-teleport", "0 0.1 -3", rig, "0 0 -3");
    createTeleport("center-down-teleport", "0 0.1 0.2", rig, "0 0 0.2");

    rig.appendChild(camera);
    AFRAME.scenes[0].appendChild(rig);
  } else {
    camera.setAttribute(
      "orbit-controls",
      "target: 0 1 -1.4; initialPosition: -0.5 1.4 0.3; minDistance: -0.01; enableZoom: false;"
    );

    var graphScaler = document.createElement("a-entity");
    graphScaler.setAttribute("data-aabb-collider-dynamic", "true");
    graphScaler.setAttribute("class", "grabbable visible-on-vr");
    graphScaler.setAttribute("position", "-0.8 1 -0.15");
    graphScaler.setAttribute("rotation", "0 70 0");
    graphScaler.setAttribute("graph-parameter-ui", "graph: #plot");

    AFRAME.scenes[0].appendChild(graphScaler);
    AFRAME.scenes[0].appendChild(camera);
  }
});

const createTeleport = (id, position, rig, rigPos) => {
  let teleportationArea = document.createElement("a-entity");
  teleportationArea.setAttribute("id", id);
  teleportationArea.setAttribute("gltf-model", "#teleportationArea");
  teleportationArea.setAttribute("modify-materials", "");
  teleportationArea.setAttribute("scale", "0.035 0.035 0.035");
  teleportationArea.setAttribute("position", position);
  teleportationArea.setAttribute(
    "animation",
    "property: scale; to: 0.075 0.075 0.075; dur: 2000; startEvents: mouseenter;"
  );
  teleportationArea.setAttribute(
    "animation__2",
    "property: scale; to: 0.035 0.035 0.035; dur: 200; startEvents: mouseleave;"
  );

  let intervalIndex = 0;
  setInterval(() => {
    let scale = (Math.sin(intervalIndex) + 1) / 100 + 0.035;
    teleportationArea.setAttribute("scale", `${scale} ${scale} ${scale}`);
    intervalIndex += Math.PI / 64;
    if (intervalIndex.toFixed(4) === (2 * Math.PI).toFixed(4))
      intervalIndex = 0;
  }, 30);

  AFRAME.scenes[0].appendChild(teleportationArea);

  teleportationArea.addEventListener("model-loaded", () => {
    setGreenOpacity(teleportationArea, 0.5)
  });

  var stillHovering = false;
  var timeout = null;

  teleportationArea.addEventListener("mouseenter", () => {
    setGreenOpacity(teleportationArea, 1)
    stillHovering = true;
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(function () {
      if (stillHovering) rig.setAttribute("position", rigPos);
    }, 2000);
  });

  teleportationArea.addEventListener("mouseleave", () => {
    setGreenOpacity(teleportationArea, 0.5)
    stillHovering = false;
    if (timeout) clearTimeout(timeout)
  });

  return teleportationArea;
};

function setGreenOpacity(element, opacity) {
  const obj = element.getObject3D("mesh");
  obj.traverse((node) => {
    try {
      if (node.name === "Plane") {
        node.children.forEach((mesh) => {
          mesh.material.color = { r: 0, g: opacity, b: 0 };
        });
      }
    } catch (e) {
      console.error(e);
    }
  });
}
