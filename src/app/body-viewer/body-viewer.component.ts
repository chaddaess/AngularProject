import {Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {Color} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RoutinesService} from "../services/routines.service";
import {Muscle} from "../model/muscle";
import {MuscleTooltipComponent} from "../muscle-tooltip/muscle-tooltip.component";

@Component({
  selector: 'app-body-viewer',
  standalone: true,
  imports: [MuscleTooltipComponent],
  templateUrl: './body-viewer.component.html',
  styleUrl: './body-viewer.component.css'
})
export class BodyViewerComponent implements OnInit, OnDestroy {

  @ViewChild('canvas3d', {static: true}) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() width: number = window.innerWidth;
  @Input() backgroundColor: Color = new THREE.Color('white');
  @Input() height: number = window.innerHeight;

  public tooltipPosition = {x: 0, y: 0};
  public hoveredPartName: Muscle | null = null;
  private renderer!: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private animationFrameId: number = 0;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private hoveredMesh: THREE.Object3D | null = null;
  // Keep reference to the original material to revert color
  private originalMaterial: THREE.Material | null = null;
  private hoverColor = new THREE.Color('red');
  private routinesService = inject(RoutinesService);
  private muscleMap = new Map<string, Muscle>();

  ngOnInit() {
    this.initScene();
    this.loadValidMuscleNames();
    this.renderer.domElement.addEventListener('mousemove', this.onPointerMove.bind(this), false);
    this.animate();
  }

  ngOnDestroy() {
    // Clean up the event listener
    this.renderer.domElement.removeEventListener('mousemove', this.onPointerMove);
    cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initScene() {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    this.renderer.setSize(this.width, this.height);
    this.scene.background = this.backgroundColor;

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 1.6, 3);

    // Create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;  // smoother rotation
    this.controls.dampingFactor = 0.05;

    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);

    this.loadHumanModel();
  }

  private loadHumanModel() {
    const loader = new GLTFLoader();

    loader.load('assets/models/muscles.glb', (gltf: { scene: any; }) => {
      // On load complete
      const humanScene = gltf.scene;
      this.scene.add(humanScene);
    }, (xhr: { loaded: number; total: number; }) => {
      // Called while loading is progressing
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (error: any) => {
      console.error('An error happened during model loading:', error);
    });
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private loadValidMuscleNames() {
    this.routinesService.getMuscles().subscribe({
      next: (muscles: Muscle[]) => {
        muscles.forEach(m => {
          // Convert spaces to underscores, e.g. "Triceps brachii" -> "Triceps_brachii"
          const nameWithUnderscores = m.name.replace(/\s+/g, '_');
          this.muscleMap.set(nameWithUnderscores, m);
        });
      }, error: err => console.error('Could not load muscle list', err)
    });
  }

  private onPointerMove(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const firstHit = intersects[0].object;

      this.tooltipPosition.x = event.clientX - rect.left + 10;
      this.tooltipPosition.y = event.clientY - rect.top + 10;

      // Check if muscle name is recognized in your Map
      if (this.muscleMap.has(firstHit.name)) {
        // Fetch the entire Muscle object
        const muscle = this.muscleMap.get(firstHit.name);

        if (muscle) {
          // Store it in a public property if you want to use it in your UI
          this.hoveredPartName = muscle;

          // If new hovered mesh, unhighlight old and highlight this one
          if (this.hoveredMesh !== firstHit) {
            this.clearHover();
            this.hoveredMesh = firstHit;

            // Highlight if it's a mesh with a material
            if ((firstHit as THREE.Mesh).material) {
              this.originalMaterial = (firstHit as THREE.Mesh).material as THREE.Material;

              const highlightMaterial = this.originalMaterial.clone() as THREE.MeshStandardMaterial;
              highlightMaterial.color = this.hoverColor;
              (this.hoveredMesh as THREE.Mesh).material = highlightMaterial;
            }
          }
        }
      } else {
        // Not a recognized muscle
        this.clearHover();
      }
    } else {
      this.clearHover();
    }
  }

  private clearHover() {
    if (this.hoveredMesh && this.originalMaterial) {
      (this.hoveredMesh as THREE.Mesh).material = this.originalMaterial;
    }
    this.hoveredMesh = null;
    this.originalMaterial = null;
    this.hoveredPartName = null;
  }
}
