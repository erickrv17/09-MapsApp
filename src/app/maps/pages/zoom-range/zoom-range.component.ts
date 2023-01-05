import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .map-container {
        width:100%;
        height:100%;       
      }
      .row{
        background-color: white;
        position:fixed;
        bottom:50px;
        left: 50px;
        padding: 10px;
        border-radius: 5px;
        z-index:99999;
        width: 400px;
      }
    `
  ]
})


export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map') divMap!: ElementRef; //This viewchild is to get the local reference we are using in HTML
  map!: mapboxgl.Map;
  zoomLevel: number=10;
  center: [number, number] = [-84.21406934548618,10.016489445370958 ];

  constructor() {
    //console.log('constructor', this.divMap); 
    //Este log fue colocado para demostrar que en esta parte de vida del proyecto no hay elemento de Mapa 
    //que podamos utilizar
   }

  ngOnDestroy(): void {
    this.map.off('zoom', () => {});
    this.map.off('zoomstart', () => {});
    this.map.off('zoomend', () => {});
    this.map.off('move', () => {});
  }

  ngAfterViewInit(): void {
    //console.log('afterViewInit', this.divMap); //ESTO SE HIZO CON EL FIN DE QUE SE APRECIE QUE NO TENEMOS EL ELEMENTO EN ESTA PARTE
    //DE CICLO DE VIDA POR LO TANTO SE DEBE CAMBIAR A AFTERVIEW
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement, // Local Reference Solo acepta string o elemento HTML
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.center, // starting position [lng, lat]
      zoom: this.zoomLevel // starting zoom
      });

      this.map.on('zoom', (ev) =>{
        this.zoomLevel = this.map.getZoom();
        
        //console.log('zoom');
        //console.log(ev);

        //const zoomC = this.map.getZoom();
        //console.log(zoomC);
      })

      this.map.on('zoomend', (ev) =>{
        if (this.map.getZoom() > 18) {
          this.map.zoomTo(18);
        }
      })

      this.map.on('zoomstart', (ev) =>{
        if (this.map.getZoom() < 1) {
          this.map.zoomTo(1);
        }
      })

      this.map.on('move', (ev) => {
        const target= ev.target;
        //console.log(target.getCenter());
        const{lng, lat} = target.getCenter();
        this.center= [lng,lat];
      })


  }

  /*ngOnInit(): void {
    console.log('onInit', this.divMap); //ESTO SE HIZO CON EL FIN DE QUE SE APRECIE QUE NO TENEMOS EL ELEMENTO EN ESTA PARTE
    //DE CICLO DE VIDA POR LO TANTO SE DEBE CAMBIAR A AFTERVIEW
    this.map = new mapboxgl.Map({
      container: 'map', // container ID Solo acepta string o elemento HTML
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-84.21406934548618,10.016489445370958 ], // starting position [lng, lat]
      zoom: 17, // starting zoom
      });
  }*/



  zoomIn(){
    //console.log('zoomIn');
    this.map.zoomIn();
    //this.zoomLevel=this.map.getZoom();
    //console.log(this.map.getZoom());

  }
  zoomOut(){
    //console.log('zoomOut');
    this.map.zoomOut();
    //this.zoomLevel=this.map.getZoom();
    //console.log(this.map.getZoom());


    //console.log('zoomOut', this.divMap); 
    //Aqui segun el log se muestra el componente de Mapa por primera vez... no en el construc, ni en el onInit por eso se utiliza el AfterViewInit
  }

  zoomChanged(value: string){
    //console.log(value);
    this.map.zoomTo(Number(value));
  }

}
