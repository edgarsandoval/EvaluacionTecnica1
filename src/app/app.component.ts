import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
    isLoading: boolean = false;
    locations: any = [];

    constructor(protected _http: HttpClient) {
    }

    ngOnInit() {
        let locations = localStorage.getItem('locations');
        if(locations !== null) {
            this.locations = JSON.parse(locations);
        }
    }

    getLocation() {
        this.isLoading = true;
        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                this.isLoading = false;

                let location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    zip_code: 'TBD'
                };

                const API_KEY = 'AIzaSyDozjIMizOcghj8l7epwn_Jm28VMMj--qY';
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${ API_KEY }`;
                this._http.get(url).subscribe((result: any) => {
                    if(result.status == 'OK') {
                        location.zip_code = result.results['0'].address_components.find(componente => componente.types.includes('postal_code')).long_name;
                        this.locations.push(location);
                        localStorage.setItem('locations', JSON.stringify(this.locations));
                    }
                });

            }, error => {
                if(error.PERMISSION_DENIED) {
                    alert('The user have denied the request for Geolocation');
                }
            });
        } else {
            alert('The Browser Does no Support Geolocation');
        }
    }
}
