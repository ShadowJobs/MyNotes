import { useEffect } from "react";
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function init() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
    // 创建渲染器
    var renderer = new THREE.WebGLRenderer();
    // 设置渲染器的初始颜色
    renderer.setClearColor(new THREE.Color(0xeeeeee));
    // 设置输出canvas画面的大小
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置渲染物体阴影
    renderer.shadowMapEnabled = true;
    // 显示三维坐标系
    // var axes = new THREE.AxisHelper(20)
    var axes = new THREE.AxesHelper(20)
    // 添加坐标系到场景中
    scene.add(axes);
    // 创建地面的几何体
    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    // 给地面物体上色
    var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    // 创建地面
    var plane = new THREE.Mesh(planeGeometry, planeMaterial)
    // 物体移动位置
    // plane.rotation.x = -0.5 * Math.PI;
    // plane.position.x = 15;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.castShadow = true;
    // 接收阴影
    plane.receiveShadow = true;
    scene.add(plane);

    // 添加立方体
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = 0;
    cube.position.y = 4;
    cube.position.z = 2;
    // 对象是否渲染到阴影贴图当中
    cube.castShadow = true;
    scene.add(cube)

    // 球体
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var spherMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
    var sphere = new THREE.Mesh(sphereGeometry, spherMaterial)
    sphere.position.x = 10;
    sphere.position.y = 4;
    sphere.position.z = 0;
    // 对象是否渲染到阴影贴图当中
    sphere.castShadow = true;
    scene.add(sphere)

    // 创建聚光灯
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(130, 130, -130);
    spotLight.castShadow = true;
    // 添加聚光灯
    scene.add(spotLight)

    // 定位相机，并且指向场景中心
    camera.position.x = 30;
    camera.position.y = 30;
    camera.position.z = 30;
    camera.lookAt(scene.position)

    // 将渲染器输出添加html元素中
    document.getElementById('webgl-output').appendChild(renderer.domElement);
    renderer.render(scene, camera)

    // 创建controls对象;  支持鼠标操作
    var controls = new OrbitControls(camera, renderer.domElement)
    // 监听控制器的鼠标事件，执行渲染内容
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    })
    setTimeout(() => {
        cube.rotateY(0.4)
        renderer.render(scene, camera)
    }, 300);
}
 const Three1: React.FC = () => {
    useEffect(()=>{ init() },[])
    return <div>
        展示坐标系，球体，方块
        安装模块：three, city安装模块dat.gui
        three用的资源在public/ 的 threeres model textures下
	    <div id="webgl-output"></div>
    </div>
}
export default Three1;