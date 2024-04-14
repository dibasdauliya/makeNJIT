function STLViewer(model, elementID) {
  let elem = document.getElementById(elementID)
  let camera = new THREE.PerspectiveCamera(
    70,
    elem.clientWidth / elem.clientHeight,
    1,
    1000
  )
  let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(elem.clientWidth, elem.clientHeight)
  elem.appendChild(renderer.domElement)

  window.addEventListener(
    'resize',
    function () {
      renderer.setSize(elem.clientWidth, elem.clientHeight)
      camera.aspect = elem.clientWidth / elem.clientHeight
      camera.updateProjectionMatrix()
    },
    false
  )

  let controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.rotateSpeed = 0.05
  controls.dampingFactor = 0.1
  controls.enableZoom = true
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.75

  let scene = new THREE.Scene()
  scene.add(new THREE.HemisphereLight(0xffffff, 1))

  new THREE.STLLoader().load(model, function (geometry) {
    let material = new THREE.MeshPhongMaterial({
      color: 0xff5533,
      specular: 100,
      shininess: 100
    })
    let mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let middle = new THREE.Vector3()
    geometry.computeBoundingBox()
    geometry.boundingBox.getCenter(middle)
    mesh.geometry.applyMatrix(
      new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
    )

    let largestDimension = Math.max(
      geometry.boundingBox.max.x,
      geometry.boundingBox.max.y,
      geometry.boundingBox.max.z
    )
    camera.position.z = largestDimension * 2

    let animate = function () {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()
  })
}

window.onload = function () {
  STLViewer('./assets/3d-file.stl', 'model')
}
