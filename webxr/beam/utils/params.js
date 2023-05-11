let beamLength = 20;
let beamDepth = 1.5;
let beamHeight = 0.2
let supportType = "Fixed"
let supportVisible = true
let colorType = 1 //Bending Moment
let applied_load = 0.01
let load_position = 10


export let beam_offset = new THREE.Vector3(0, 3, -6);
export let beam_upper_offset = new THREE.Vector3(0, 3.65, -6);
export let beam_lower_offset = new THREE.Vector3(0, 2.2, -6);

export let pin_radius = 1;

export let params = {
    length: beamLength, // beam length (m)
    depth: beamDepth,
    height: beamHeight,
    left: supportType,
    right: supportType,
    applied_load: applied_load,
    load_position:load_position,
    support_visible: supportVisible,
    youngs_modulus: 215,
    colour_by: colorType,
    np: 100, // number of points along beam
    displacement_control: true,
    displacement: new THREE.Vector3(0, 0, 0),
}

export let params_upper = {
    length: beamLength, // beam length (m)
    depth: beamDepth,
    height: beamHeight,
    left: supportType,
    right: supportType,
    applied_load: applied_load,
    load_position: load_position,
    support_visible: supportVisible,
    youngs_modulus: 215,
    colour_by: colorType,
    np: 100, // number of points along beam
    displacement_control: true,
    displacement: new THREE.Vector3(0, 0, 0),
}

export let params_lower = {
    length: beamLength, // beam length (m)
    depth: beamDepth,
    height: beamHeight,
    left: supportType,
    right: supportType,
    applied_load: applied_load,
    load_position: load_position,
    support_visible: supportVisible,
    youngs_modulus: 215,
    colour_by: colorType,
    np: 100, // number of points along beam
    displacement_control: true,
    displacement: new THREE.Vector3(0, 0, 0),
}