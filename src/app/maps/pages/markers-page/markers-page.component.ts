import { Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
	marker: Marker;
	color: string;
}

interface PlainMarker {
	color: string;
	lngLat: number[];
}

@Component({
	templateUrl: './markers-page.component.html',
	styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent {
	@ViewChild('map') divMap?: ElementRef;
	public markers: MarkerAndColor[] = [];

	public map?: Map;
	public lngLat: LngLat = new LngLat(-103.3039951, 20.5208305);

	ngAfterViewInit(): void {

		if (!this.divMap) throw 'El elemento HTML no fue encontrado';

		this.map = new Map({
			container: this.divMap.nativeElement, // container ID
			style: 'mapbox://styles/mapbox/streets-v12', // style URL
			center: this.lngLat, // starting position [lng, lat]
			zoom: 12, // starting zoom
		});

		const marker = new Marker({
			// color: '#FFAADD',
		})
			.setLngLat(this.lngLat)
			.addTo(this.map);

		this.loadFromLocalStorage();
	}

	createMarker() {
		if (!this.map) throw 'Mapa no inicializado';
		const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
		const lngLat = this.map?.getCenter();
		this.addMarker(lngLat, color);
	}

	addMarker(lngLat: LngLat, color: string) {
		if (!this.map) throw 'Mapa no inicializado';
		const marker = new Marker({
			color,
			draggable: true
		})
			.setLngLat(lngLat)
			.addTo(this.map);

		this.markers.push({ marker, color });
		this.saveToLocalStorage();

		marker.on('dragend', () => {
			this.saveToLocalStorage();
		});
	}

	deleteMarker(index: number) {
		this.markers[index].marker.remove();
		this.markers.splice(index, 1);
		this.saveToLocalStorage();
	}

	flyTo(marker: Marker) {
		this.map?.flyTo({ center: marker.getLngLat(), zoom: 15 });
	}

	saveToLocalStorage() {
		const plainMarkers: PlainMarker[] = this.markers.map(({ color, marker }) => {
			return {
				color,
				lngLat: marker.getLngLat().toArray()
			};
		});

		localStorage.setItem('markers', JSON.stringify(plainMarkers));
	}

	loadFromLocalStorage() {
		const plainMarkersStr = localStorage.getItem('markers') ?? '[]';
		const plainMarkers = JSON.parse(plainMarkersStr) as PlainMarker[];

		plainMarkers.forEach(({ color, lngLat }) => {
			const [lng, lat] = lngLat;
			this.addMarker(new LngLat(lng, lat), color);
		})
	}

}
