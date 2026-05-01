declare const THREE: typeof import('three');

declare namespace THREE {
	type Scene = import('three').Scene;
	type PlaneGeometry = import('three').PlaneGeometry;
	type MeshPhongMaterial = import('three').MeshPhongMaterial;
	type Mesh = import('three').Mesh;
	type TextureLoader = import('three').TextureLoader;
	type DirectionalLight = import('three').DirectionalLight;
	type AmbientLight = import('three').AmbientLight;
	type HemisphereLight = import('three').HemisphereLight;
	type Group = import('three').Group;
	type SphereGeometry = import('three').SphereGeometry;
	type MeshBasicMaterial = import('three').MeshBasicMaterial;
	type Box3 = import('three').Box3;
	type Vector3 = import('three').Vector3;
	type Line = import('three').Line;
	type BufferGeometry = import('three').BufferGeometry;
	type LineBasicMaterial = import('three').LineBasicMaterial;
	type DoubleSide = import('three').DoubleSide;
	type WebGLRenderer = import('three').WebGLRenderer;
	type PerspectiveCamera = import('three').PerspectiveCamera;
	type PCFSoftShadowMap = import('three').PCFSoftShadowMap;
	type Texture = import('three').Texture;
	type Material = import('three').Material;
	type Object3D = import('three').Object3D;
	type BufferAttribute = import('three').BufferAttribute;
	type Color = import('three').Color;
}

declare global {
	var PLAYERS: any[];
	interface Window {
		THREE: typeof import('three');
		PLAYERS: any[];
	}
}

export {};
