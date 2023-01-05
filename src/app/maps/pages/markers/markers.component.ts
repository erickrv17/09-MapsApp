import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


interface MarkerColor {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styles: [
    `
      .map-container {
        width:100%;
        height:100%;       
      }

      .list-group {
        position:fixed;
        top:20px;
        right:20px;
        z-index: 9999;

      }

      li {
        cursor: pointer;
      }
    `
  ]
})

export class MarkersComponent implements AfterViewInit {
  @ViewChild('map') divMap!: ElementRef; //This viewchild is to get the local reference we are using in HTML
  map!: mapboxgl.Map;
  zoomLevel: number=15;
  center: [number, number] = [-84.21406934548618,10.016489445370958 ];

  //Markers array
  markers: MarkerColor[]=[];

  constructor() { }
  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
    container: this.divMap.nativeElement, // Local Reference Solo acepta string o elemento HTML
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: this.center, // starting position [lng, lat]
    zoom: this.zoomLevel // starting zoom
    });

    this.readMarkersLocalS();


    /*const markerHTML: HTMLElement = document.createElement('div');
    markerHTML.innerHTML='Hello World';*/

    //const marker = new mapboxgl.Marker(/*{element: markerHTML}*/).setLngLat(this.center).addTo(this.map);

  }

  goToM(marker: mapboxgl.Marker){
    //console.log('Marker info:', marker);
   this.map.flyTo({
    center:marker.getLngLat(),
    zoom: 18
   })
  }

  addNewM(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const newMarker= new mapboxgl.Marker({
      draggable: true,
      color:color
    }).setLngLat(this.center).addTo(this.map);
    this.markers.push( {color, marker: newMarker}); //Adding to array

    //Saving the marker in Local Storage
    this.saveMarkersLocalS();
  }

  saveMarkersLocalS(){

    const lngLatArr: MarkerColor[] = [];
    this.markers.forEach(m => {
      const color= m.color;
      const {lng, lat}= m.marker!.getLngLat();

      lngLatArr.push({
        color: color,
        center: [lng, lat]
      })
    })
    localStorage.setItem('markers',JSON.stringify(lngLatArr));
  }

  readMarkersLocalS(){
    if (!localStorage.getItem('markers')) {
      return;
    }

    const lngLatArr : MarkerColor[] = JSON.parse(localStorage.getItem('markers')!);

    //console.log(lngLatArr);

    lngLatArr.forEach(m => {
      const newMarker= new mapboxgl.Marker({
        color:m.color,
        draggable:true
      })
      .setLngLat(m.center!)
      .addTo(this.map)
    
      this.markers.push({
         marker: newMarker,
         color: m.color
      });

      newMarker.on('dragend', () => {
        //console.log('drag');
        this.saveMarkersLocalS();
      })
    })
    
  }

  deleteMarker(i: number){
    console.log('Deleting marker:', i);
    this.markers[i].marker?.remove();
    this.markers.splice(i,1);
    this.saveMarkersLocalS();
  }

}
