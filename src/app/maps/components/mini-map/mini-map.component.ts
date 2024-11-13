import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

@Component({
	selector: 'mini-map',
	templateUrl: './mini-map.component.html',
	styleUrl: './mini-map.component.css'
})
export class MiniMapComponent implements AfterViewInit {

	@Input() lngLat?: [number, number];
	@ViewChild('map') divMap?: ElementRef;
	public map?: Map;

	ngAfterViewInit(): void {
		if(!this.lngLat) throw new Error('lngLat is required');
		if(!this.divMap ) throw new Error('Map Div not found');

		this.map = new Map({
			container: this.divMap.nativeElement, // container ID
			style: 'mapbox://styles/mapbox/streets-v12', // style URL
			center: this.lngLat, // starting position [lng, lat]
			zoom: 13, // starting zoom
			interactive: false
		});

		new Marker()
			.setLngLat(this.lngLat)
			.addTo(this.map);
	}
}
