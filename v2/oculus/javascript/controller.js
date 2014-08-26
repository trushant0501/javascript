// Generated by CoffeeScript 1.7.1
(function() {
  var controller, makeLight, positionLight, releaseLight;

  window.controller = controller = new Leap.Controller({
    background: true
  });

  controller.use('transform', {
    quaternion: (new THREE.Quaternion).setFromEuler(new THREE.Euler(Math.PI * -0.3, 0, Math.PI, 'ZXY')),
    position: new THREE.Vector3(0, 100, 0)
  });

  controller.use('riggedHand', {
    parent: window.scene,
    camera: window.camera,
    positionScale: 2,
    renderFn: null,
    boneColors: function(boneMesh, leapHand) {
      return {
        hue: 0.6,
        saturation: 0.2,
        lightness: 0.8
      };
    }
  });

  controller.use('playback', {
    recording: 'leap-playback-recording-57fps.json.lz',
    loop: false
  });

  controller.connect();

  makeLight = function(hand) {
    var light, lightVisualizer;
    light = window.lights.pop();
    lightVisualizer = window.lightVisualizers.pop();
    light.intensity = 8;
    hand.data('light', light);
    lightVisualizer.position = light.position;
    lightVisualizer.visible = true;
    return hand.data('lightVisualizer', lightVisualizer);
  };

  releaseLight = function(hand) {
    var light, lightVisualizer;
    console.log('hand lost');
    light = hand.data('light');
    if (!light) {
      return;
    }
    light.intensity = 0;
    window.lights.push(light);
    hand.data('light', null);
    lightVisualizer = hand.data('lightVisualizer');
    lightVisualizer.visible = false;
    window.lightVisualizers.push(lightVisualizer);
    return hand.data('lightVisualizer', null);
  };

  positionLight = function(hand) {
    var handMesh, light, offsetDown, offsetForward, pos;
    handMesh = hand.data('riggedHand.mesh');
    if (hand.pinchStrength > 0.5) {
      if (!hand.data('pinching')) {
        makeLight(hand);
        hand.data('pinching', true);
      }
      if (light = hand.data('light')) {
        pos = Leap.vec3.clone(hand.palmPosition);
        offsetDown = Leap.vec3.clone(hand.palmNormal);
        Leap.vec3.multiply(offsetDown, offsetDown, [50, 50, 50]);
        Leap.vec3.add(pos, pos, offsetDown);
        offsetForward = Leap.vec3.clone(hand.direction);
        Leap.vec3.multiply(offsetForward, offsetForward, [30, 30, 30]);
        Leap.vec3.add(pos, pos, offsetForward);
        return handMesh.scenePosition(pos, light.position);
      }
    } else {
      if (hand.data('pinching')) {
        releaseLight(hand);
        return hand.data('pinching', false);
      }
    }
  };

  controller.on('handLost', releaseLight);

  controller.on('hand', positionLight);

}).call(this);
